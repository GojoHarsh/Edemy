import { Webhook } from "svix"; 
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import user from "../models/User.js";
import Course from "../models/Course.js";


//API Controller function to manage Clerk user with database
export const clerkWebhooks = async(req, res)=>{
    try{
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        })
        const {data, type} = req.body;
        
        switch (type) {
            case 'user.created':{
                const userData ={
                    _id: data.id,
                    name:data.first_name + " " + data.last_name,
                    email:data.email_addresses[0].email_address,
                    imageUrl:data.image_url,
                }
                await User.create(userData);
                res.json({});
                break;
            }
           case 'user.updated':{
            const userData ={
                name:data.first_name + " " + data.last_name,
                email:data.email_address[0].email_address,
                imageUrl:data.image_url,
            }
            await User.findByIdAndUpdate(data.id,userData);
            res.json({});
            break;
           }
           case 'user.deleted':{
                await User.findByIdAndDelete(data.id);
                res.json({});
                break;
           }
            default:
                res.json({});
                break;
        }
    } catch(error){
        console.error("Clerk webhook error:", error);
        res.status(200).json({
            success:false,
            message:error.message,
        });
    }
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async(request, response)=>{
    try {
        console.log("Received Stripe webhook");
        const sig = request.headers['stripe-signature'];
        
        // Use the raw body that was collected in the middleware
        let event;
        try {
            event = stripeInstance.webhooks.constructEvent(
                request.rawBody, 
                sig, 
                process.env.STRIPE_WEBHOOK_SECRET
            );
            console.log("Webhook verified successfully, type:", event.type);
        } catch (err) {
            console.error("Webhook signature verification failed:", err.message);
            // Return 200 status even for verification failures
            return response.status(200).json({ 
                received: false, 
                error: `Signature verification failed: ${err.message}` 
            });
        }
    
        // Handle the event
        try {
            switch (event.type) {
                case 'payment_intent.succeeded': { 
                    const paymentIntent = event.data.object;
                    const paymentIntentid = paymentIntent.id;
                    console.log(`Payment succeeded: ${paymentIntentid}`);
                
                    // Retrieve checkout session
                    const session = await stripeInstance.checkout.sessions.list({
                        payment_intent: paymentIntentid,
                    });
                    
                    if (!session.data || session.data.length === 0) {
                        console.error("No session found for payment intent:", paymentIntentid);
                        return response.status(200).json({ received: true });
                    }
                    
                    const { purchaseId } = session.data[0].metadata || {};
                    
                    if (!purchaseId) {
                        console.error("No purchaseId in session metadata");
                        return response.status(200).json({ received: true });
                    }
                    
                    console.log(`Processing purchase: ${purchaseId}`);
                    
                    // Find purchase record
                    const purchaseData = await Purchase.findById(purchaseId);
                    if (!purchaseData) {
                        console.error("Purchase not found:", purchaseId);
                        return response.status(200).json({ received: true });
                    }
                    
                    // Find user and course
                    const userData = await user.findById(purchaseData.userId);
                    if (!userData) {
                        console.error("User not found:", purchaseData.userId);
                        return response.status(200).json({ received: true });
                    }
                    
                    const courseData = await Course.findById(purchaseData.courseId.toString());
                    if (!courseData) {
                        console.error("Course not found:", purchaseData.courseId);
                        return response.status(200).json({ received: true });
                    }
                    
                    // Update course enrollments
                    if (!courseData.enrolledStudents.includes(userData._id)) {
                        courseData.enrolledStudents.push(userData);
                        await courseData.save();
                    }
                    
                    // Update user enrollments
                    if (!userData.enrolledCourses.includes(courseData._id)) {
                        userData.enrolledCourses.push(courseData._id);
                        await userData.save();
                    }
                    
                    // Update purchase status
                    purchaseData.status = 'completed';
                    await purchaseData.save();
                    
                    console.log(`Purchase ${purchaseId} updated to completed`);
                    break;
                }
                
                case 'payment_intent.payment_failed': {
                    const paymentIntent = event.data.object;
                    const paymentIntentid = paymentIntent.id;
                    console.log(`Payment failed: ${paymentIntentid}`);
                    
                    const session = await stripeInstance.checkout.sessions.list({
                        payment_intent: paymentIntentid,
                    });
                    
                    if (!session.data || session.data.length === 0) {
                        console.error("No session found for failed payment intent:", paymentIntentid);
                        return response.status(200).json({ received: true });
                    }
                    
                    const { purchaseId } = session.data[0].metadata || {};
                    
                    if (!purchaseId) {
                        console.error("No purchaseId in session metadata for failed payment");
                        return response.status(200).json({ received: true });
                    }
                    
                    const purchaseData = await Purchase.findById(purchaseId);
                    if (purchaseData) {
                        purchaseData.status = 'failed';
                        await purchaseData.save();
                        console.log(`Purchase ${purchaseId} updated to failed status`);
                    } else {
                        console.error("Purchase not found for failed payment:", purchaseId);
                    }
                    break;
                }
                
                default:
                    console.log(`Unhandled event type ${event.type}`);
            }
            
            // Return success response
            return response.status(200).json({ received: true });
            
        } catch (err) {
            console.error("Error processing webhook event:", err);
            // Still return 200 status to prevent Stripe from retrying
            return response.status(200).json({ 
                received: true, 
                error: `Error processing event: ${err.message}` 
            });
        }
    } catch (err) {
        console.error("Unexpected webhook error:", err);
        // Always return 200 to prevent Stripe from retrying
        return response.status(200).json({ 
            received: true, 
            error: `Unexpected error: ${err.message}` 
        });
    }
}