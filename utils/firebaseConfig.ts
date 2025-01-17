import { initializeApp } from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';
const firebaseConfig = {
  apiKey: "AIzaSyCLulDSMfyp9v5kSI5P0bEUd-b44d6rSbQ", // From "api_key"
  authDomain: "mx-bill-pay-5c87d.firebaseapp.com", // Replace "project_id" with this format
  projectId: "mx-bill-pay-5c87d", // From "project_id"
  storageBucket: "mx-bill-pay-5c87d.appspot.com", // From "storage_bucket"
  messagingSenderId: "576378105680", // From "project_number"
  appId: "1:576378105680:android:b9f421900f863137eec655", // From "mobilesdk_app_id"
  measurementId: "G-XXXXXXXXXX" // Optional; ensure you enable Google Analytics in Firebase Console
};

// // Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics =  getAnalytics(app);

export { analytics };


export const logSignUpEvent = async (method:string) => {
    // Your sign-up logic here
  
    console.log('Sign up event triggered');
    // Log the sign_up event
    await analytics().logSignUp({ method });
    console.log('Sign up event logged');
  };