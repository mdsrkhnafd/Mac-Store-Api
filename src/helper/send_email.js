// import the necessary aws sdk module for ses
const {SESClient, SendEmailCommand, Body$} = require("@aws-sdk/client-ses");

// Load environment variables from a .env file if present
require('dotenv').config();

// Initialize the SES client using credentials from environment variables

const client = new SESClient({
    region: process.env.AWS_REGION, // AWS region where SES is configured and to send emails from
    credentials: {
        accessKeyId: process.env.AWS_SES_ACCESS_KEY_ID, // AWS Access Key ID
        secretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY // AWS Secret Access Key
    },   
    // apiVersion: process.env.AWS_SES_API_VERSION || '2010-12-01' // API version for SES
});

// Function to generate simple HTML content for Welcome Email
const generateOtpEmailHTML = (otp) => {
    return `
    <html>
        <body>
            <h1>Welcome to ${process.env.APP_NAME}!</h1>
            <p>Your One-Time password (OTP) for email verification is: </p>
            <p><strong>${otp}</strong></p>
            <p>Please enter this OTP to verify your email address. This code is valid for the next 10 minutes. </p>
            <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
        </body>
    </html>
    `;
}

// Function to send Welcome Email to the provided email address
const sendOtpEmail = async (email , otp) => {
    // Define the parameters for the SES email message
    const params = {
        Source: process.env.EMAIL_FROM, // The Send Email address
        ReplyToAddresses: [process.env.EMAIL_TO], // Reply-To address

        // destination email address
        Destination: {
            ToAddresses: [email] // Recipient email address
        },

        // Email message details
        Message:{
            Body:{
                Html: {
                    Charset: "UTF-8", // Ensure proper character encoding for HTML content
                    Data: generateOtpEmailHTML(otp) // generate HTML content for the email body
            }
            },
            Subject:{
                Charset: 'UTF-8', // Ensure proper character encoding for the subject
                Data: `Macstore Email Verification` // Subject line for the email
            }
        }
    };

    // create a new SendEmailCommand with the defined parameters above
    const command = new SendEmailCommand(params);

    try {
        // Send the email using the SES client and await the response
        const response = await client.send(command);
        console.log("Email sent successfully:", response); // Log success message with response details
        return response; // Return the response from the send operation
    } catch (error) {
        console.error("Error sending email:", error); // Log any errors that occur during the send process
        throw error; // Rethrow the error for further handling if needed
    }
}

module.exports = { sendOtpEmail }; // Export the sendOtpEmail function for use in other modules