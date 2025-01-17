import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';

const SettingsPrivacyPolicy = () => {
    const { colors, dark } = useTheme();

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header title="Privacy Policy" />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>Privacy Policy for Mx Bill Pay</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>Welcome to Mx Bill Pay! We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our bill payment app, accessible at https://mxbillpay.com/.</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>1. Information We Collect</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>We collect various types of information in connection with the services we provide, including:</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>a. Personal Information:</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- Name</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- Email address</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- Phone number</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- Payment information (e.g., credit card details, bank account information)</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- Billing address</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>b. Non-Personal Information:</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- Device information (e.g., IP address, browser type, operating system)</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- Usage data (e.g., pages visited, time spent on the app)</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>2. How We Use Your Information</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>We use the collected information for the following purposes:</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- To process and manage bill payments</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- To communicate with you regarding your account and transactions</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- To provide customer support</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- To improve our app and services</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- To send you promotional materials and updates (with your consent)</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- To comply with legal obligations</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>3. Information Sharing and Disclosure</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>We do not sell, trade, or otherwise transfer your personal information to outside parties except in the following circumstances:</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- To trusted third-party service providers who assist us in operating our app and conducting our business, as long as those parties agree to keep this information confidential</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- To comply with legal requirements, enforce our site policies, or protect our rights or the rights of others</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>- In the event of a merger, acquisition, or sale of all or a portion of our assets</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>4. Data Security</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>We implement a variety of security measures to maintain the safety of your personal information. These measures include encryption, secure socket layer (SSL) technology, and regular security audits. However, no method of transmission over the internet or electronic storage is 100% secure, so we cannot guarantee absolute security.</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>5. Cookies and Tracking Technologies</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>We use cookies and similar tracking technologies to enhance your experience on our app. Cookies are small files that a site or its service provider transfers to your device’s hard drive through your web browser (if you allow) that enables the site’s or service provider’s systems to recognize your browser and capture and remember certain information. You can choose to disable cookies through your browser settings, but doing so may affect the functionality of our app.</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>6. Third-Party Links</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>Our app may contain links to third-party websites. These third-party sites have separate and independent privacy policies. We have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our app and welcome any feedback about these sites.</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>7. Children’s Privacy</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>Our app is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently received personal information from a child under the age of 13, we will delete such information from our records.</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>8. Changes to Our Privacy Policy</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our app and updating the effective date at the top of this policy. You are advised to review this Privacy Policy periodically for any changes.</Text>
                    </View>

                    <View>
                        <Text style={[styles.settingsTitle, { color: dark ? COLORS.white : COLORS.black }]}>9. Contact Us</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>If you have any questions or concerns about this Privacy Policy, please contact us at:</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>Mx Bill Pay</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>Email: support@mxbillpay.com</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>By using our app, you consent to our Privacy Policy.</Text>
                        <Text style={[styles.body, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>Thank you for choosing Mx Bill Pay!</Text>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    settingsTitle: {
        fontSize: 18,
        fontFamily: "bold",
        color: COLORS.black,
        marginVertical: 26
    },
    body: {
        fontSize: 14,
        fontFamily: "regular",
        color: COLORS.black,
        marginTop: 4
    }
});

export default SettingsPrivacyPolicy;
