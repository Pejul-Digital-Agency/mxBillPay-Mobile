import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import CustomToast from '@/components/CustomToast';
import TokenExpiryModal from '../app/tokenexpirymodal';
import { useAppSelector } from '@/store/slices/authSlice';

const ScreenStacks = () => {
  //   const { token } = useAppSelector((state) => state.auth);
  //   console.log('Stack: ', token);
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding2" />
        <Stack.Screen name="onboarding3" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="accountcreationmethod" />
        <Stack.Screen name="otpverification" />
        <Stack.Screen name="forgotpasswordmethods" />
        <Stack.Screen name="forgotpasswordphonenumber" />
        <Stack.Screen name="forgotpasswordemail" />
        <Stack.Screen name="createnewpin" />
        <Stack.Screen name="reasonforusingallpay" />
        <Stack.Screen name="verifyyouridentity" />
        <Stack.Screen name="proofofresidency" />
        <Stack.Screen name="photoidcard" />
        <Stack.Screen name="selfiewithidcard" />
        <Stack.Screen name="facerecognitionwalkthrough" />
        <Stack.Screen name="facerecognitionscan" />
        <Stack.Screen name="scanqrcode" />
        <Stack.Screen name="fillyourprofile" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="address" />
        <Stack.Screen name="addnewaddress" />
        <Stack.Screen name="editprofile" />
        <Stack.Screen name="settingshelpcenter" />
        <Stack.Screen name="settingssecurity" />
        <Stack.Screen name="settingslanguage" />
        <Stack.Screen name="settingsnotifications" />
        <Stack.Screen name="addnewcard" />
        <Stack.Screen name="changeemail" />
        <Stack.Screen name="changepassword" />
        <Stack.Screen name="changepin" />
        <Stack.Screen name="settingsprivacypolicy" />
        <Stack.Screen name="settingsinvitefriends" />
        <Stack.Screen name="customerservice" />
        <Stack.Screen name="allservices" />
        <Stack.Screen name="promoanddiscount" />
        <Stack.Screen name="paybillselectricitycustomerid" />
        <Stack.Screen name="paybillselectricityreviewsummary" />
        <Stack.Screen name="paybillsinternetcustomerid" />
        <Stack.Screen name="paybillsinternetreviewsummary" />
        <Stack.Screen name="paybillswatercustomerid" />
        <Stack.Screen name="paybillswaterreviewsummary" />
        <Stack.Screen name="paybillssuccessful" />
        <Stack.Screen name="requestmoney" />
        <Stack.Screen name="requestmoneyamount" />
        <Stack.Screen name="requestmoneysuccessful" />
        <Stack.Screen name="transfertobankamountform" />
        <Stack.Screen name="transfertobankselectbank" />
        <Stack.Screen name="transfertobankreviewsummary" />
        <Stack.Screen name="transfertobanksuccessful" />
        <Stack.Screen name="sendmoney" />
        <Stack.Screen name="sendmoneytypeamount" />
        <Stack.Screen name="sendmoneychoosepaymenttype" />
        <Stack.Screen name="sendmoneyreviewsummary" />
        <Stack.Screen name="sendmoneysuccessful" />
        <Stack.Screen name="inoutpaymenthistory" />
        <Stack.Screen name="inoutpaymentviewereceipt" />
        <Stack.Screen name="statisticsversion2" />
        <Stack.Screen name="statisticsversion3" />
        <Stack.Screen name="statisticsversion4" />
        <Stack.Screen name="userallpay" />
        <Stack.Screen name="ecarddetails" />
        <Stack.Screen name="ecardrefund" />
        <Stack.Screen name="ecardtopup" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast
        config={{
          success: (internalProps) => <CustomToast {...internalProps} />,
          error: (internalProps) => <CustomToast {...internalProps} />,
          info: (internalProps) => <CustomToast {...internalProps} />,
        }}
      />
      {/* <TokenExpiryModal /> */}
    </>
  );
};

export default ScreenStacks;
