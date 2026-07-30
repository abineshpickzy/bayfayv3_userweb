import React, { useEffect } from 'react';
import Aux from "../utils/auxilary";
import CustomHeader from "../components/CustomHeader/CustomHeader";

const Privacy = () => {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return (
        <Aux>
            <CustomHeader title={'PRIVACY POLICY'} />
            <div className='d-flex justify-content-center static-page-bg'>
                <div className='max-width-1000px w-100 font-size-3 py-3 px-2'>

                    <p className='font-size-1-4rem font-weight-bold mb-1 mt-3 color-teal-blue'>Privacy Policy</p>
                    <p className='text-muted mb-4'>Last Updated: 01 June 2026</p>

                    <p className='mb-2'>This Privacy Policy ("Policy") describes the policies and procedures regarding the collection, use, storage, disclosure, sharing, and protection of your information when you access or use the BayFay mobile applications, websites, merchant panels, delivery partner applications, and related services (collectively referred to as the "Platform") operated by PICKZY SOFTWARE PRIVATE LIMITED ("BayFay", "Company", "we", "our", or "us").</p>
                    <p className='mb-2'>The terms "you", "your", and "user" refer to customers, merchants, delivery partners, visitors, and any individual accessing or using the Platform or Services.</p>
                    <p className='mb-2'>Please read this Privacy Policy carefully before using the Platform or submitting any personal information to BayFay. By accessing or using the Platform, you acknowledge that you have read, understood, and agreed to the practices described in this Policy. If you do not agree with the terms of this Privacy Policy, please discontinue use of the Platform.</p>
                    <p className='mb-4'>This Privacy Policy forms an integral part of the Terms of Use and other policies published by BayFay.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Your Consent</p>
                    <p className='mb-2'>By accessing or using the BayFay Platform, you expressly consent to the collection, use, storage, transfer, disclosure, and processing of your information in accordance with this Privacy Policy and applicable laws.</p>
                    <p className='mb-2'>You further consent to receive communications, notifications, transactional messages, and service-related updates from BayFay through SMS, email, phone calls, WhatsApp messages, push notifications, or other communication channels.</p>
                    <p className='mb-4'>You may withdraw certain permissions at any time through your device settings or by contacting BayFay support. However, withdrawal of permissions may affect the availability or functionality of certain services offered on the Platform.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Information We Collect</p>
                    <p className='mb-2'>BayFay may collect information directly from you, automatically through your use of the Platform, or from third-party service providers and partners.</p>
                    <p className='mb-2'>The information collected may include your name, mobile number, email address, password, profile image, delivery address, billing address, business information, GST details, merchant/store details, and identity verification information where required.</p>
                    <p className='mb-2'>We may collect transactional information including orders placed, order history, payment details, refund requests, cancellation records, invoices, delivery instructions, and communication related to transactions performed on the Platform.</p>
                    <p className='mb-2'>BayFay may automatically collect technical and device-related information including device model, operating system version, device identifiers, application version, browser type, IP address, network information, crash logs, analytics information, app interactions, and usage behavior to improve service quality and platform performance.</p>
                    <p className='mb-2'>With your permission, BayFay may collect precise or approximate location information through GPS, Wi-Fi signals, Bluetooth, IP address, and mobile network information for nearby store discovery, address selection, delivery tracking, navigation assistance, logistics operations, fraud prevention, and service optimization.</p>
                    <p className='mb-4'>BayFay may also collect information from communications made through the Platform including customer support interactions, ratings, reviews, feedback submissions, survey participation, merchant communications, and delivery-related interactions.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Device Permissions</p>
                    <p className='mb-2'>Depending on the features used and your device settings, BayFay may request access to device permissions including location, camera, storage, photos, media, notifications, internet access, and phone functionality.</p>
                    <p className='mb-2'>Location permission may be used for delivery tracking, nearby merchant discovery, navigation assistance, order fulfillment, and delivery partner operations. Camera permission may be used for uploading product images, profile pictures, verification documents, invoices, or support attachments. Storage and media permissions may be used to upload or save files and images required for platform functionality.</p>
                    <p className='mb-2'>Notification permissions may be used to send order updates, delivery alerts, payment notifications, service announcements, promotional offers, and account-related information.</p>
                    <p className='mb-4'>Permissions are requested only when necessary for providing relevant functionality and may be managed through your device settings at any time.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>How We Use Your Information</p>
                    <p className='mb-2'>BayFay uses collected information for providing, maintaining, improving, and personalizing services offered through the Platform.</p>
                    <p className='mb-2'>Your information may be used for account creation and authentication, order processing, payment processing, delivery coordination, customer support, merchant onboarding, delivery partner management, fraud detection, dispute resolution, analytics, auditing, business operations, and compliance with legal obligations.</p>
                    <p className='mb-2'>BayFay may also use your information to send transactional notifications, security alerts, service announcements, updates regarding your account or orders, and promotional or marketing communications where permitted under applicable laws.</p>
                    <p className='mb-4'>Information may also be used for internal research, performance analysis, troubleshooting, platform optimization, and development of new products or services.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Payment Information</p>
                    <p className='mb-2'>Payments made through BayFay may be processed by authorized third-party payment gateways, banks, wallets, UPI providers, and financial institutions including Razorpay and other payment service providers.</p>
                    <p className='mb-2'>BayFay does not store complete debit card numbers, credit card numbers, CVV details, or sensitive banking credentials on its servers unless specifically permitted under applicable regulations and security standards.</p>
                    <p className='mb-4'>Payment providers may collect and process financial information according to their own privacy policies and applicable laws.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Sharing and Disclosure of Information</p>
                    <p className='mb-2'>BayFay may share your information with merchants and store partners for processing and fulfilling orders placed through the Platform.</p>
                    <p className='mb-2'>Information may be shared with delivery partners and logistics providers for pickup coordination, navigation assistance, customer communication, and delivery fulfillment.</p>
                    <p className='mb-2'>BayFay may engage third-party vendors, consultants, cloud hosting providers, analytics providers, communication service providers, payment processors, customer support systems, and technology partners who may require limited access to information for operational purposes.</p>
                    <p className='mb-2'>Information may also be disclosed where required by law, regulation, court order, legal process, government request, law enforcement authority, or regulatory body.</p>
                    <p className='mb-2'>BayFay may transfer or share information during mergers, acquisitions, restructuring, financing transactions, sale of business assets, or other corporate transactions.</p>
                    <p className='mb-4'>BayFay does not sell personal information to third parties for independent advertising or marketing purposes.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Third-Party Services</p>
                    <p className='mb-2'>BayFay may integrate with third-party products and services including Google Maps, Firebase, Razorpay, SMS and OTP providers, cloud hosting providers, analytics providers, communication platforms, advertising networks, and customer support tools.</p>
                    <p className='mb-4'>These third-party services may independently collect and process information according to their own terms and privacy policies. BayFay is not responsible for the privacy practices of third-party services not operated directly by the Company.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Cookies and Tracking Technologies</p>
                    <p className='mb-2'>BayFay may use cookies, SDKs, web beacons, analytics tools, pixels, and similar tracking technologies to improve user experience, remember preferences, monitor traffic patterns, analyze usage behavior, prevent fraud, personalize services, and optimize platform performance.</p>
                    <p className='mb-4'>Users may control cookie preferences through browser or device settings. Disabling certain tracking technologies may affect the functionality of some services.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Log Information</p>
                    <p className='mb-2'>When you access or use the Platform, BayFay servers may automatically record information including IP address, browser type, pages visited, device identifiers, operating system details, referral URLs, timestamps, app crashes, network information, and interactions with the Platform.</p>
                    <p className='mb-4'>This information is used for analytics, troubleshooting, fraud prevention, diagnostics, and system administration.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Data Retention</p>
                    <p className='mb-2'>BayFay retains personal information only for as long as reasonably necessary to provide services, complete transactions, comply with legal obligations, resolve disputes, enforce agreements, prevent fraud, and maintain operational records.</p>
                    <p className='mb-2'>Certain records may be retained for longer durations where required under taxation laws, regulatory requirements, audit obligations, or security purposes.</p>
                    <p className='mb-4'>When information is no longer required, BayFay may securely delete, anonymize, or archive such information in accordance with applicable laws and internal policies.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Data Security</p>
                    <p className='mb-2'>BayFay implements reasonable technical, organizational, and administrative safeguards designed to protect information against unauthorized access, misuse, loss, alteration, destruction, or disclosure.</p>
                    <p className='mb-2'>Security measures may include encrypted communications, secure cloud infrastructure, authentication mechanisms, restricted access controls, monitoring systems, firewall protection, periodic security reviews, and industry-standard security practices.</p>
                    <p className='mb-4'>Although BayFay strives to maintain strong security protections, no electronic storage system or internet transmission method can guarantee complete security.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>User Rights and Choices</p>
                    <p className='mb-2'>Subject to applicable laws, users may have rights to access, review, correct, update, delete, or restrict the processing of their personal information.</p>
                    <p className='mb-2'>Users may also withdraw permissions granted to the application through device settings, unsubscribe from promotional communications, or request closure of their accounts.</p>
                    <p className='mb-4'>Requests regarding personal information may be submitted by contacting <a href="mailto:support@bayfay.com" className='color-blue'>support@bayfay.com</a>. BayFay may require verification of identity before processing such requests.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Account Deletion and Closure</p>
                    <p className='mb-2'>Users may request deletion of their accounts and associated personal information through the account deletion request page available at: <a href="https://www.bayfay.com/data/sendreq" target="_blank" rel="noopener noreferrer" className='color-blue'>https://www.bayfay.com/data/sendreq</a></p>
                    <p className='mb-2'>Users may also contact <a href="mailto:support@bayfay.com" className='color-blue'>support@bayfay.com</a> regarding deletion requests or account-related concerns.</p>
                    <p className='mb-2'>Upon receiving a valid request, BayFay will take reasonable steps to delete or anonymize personal information unless retention is required for legal compliance, fraud prevention, dispute resolution, security purposes, taxation requirements, or enforcement of agreements.</p>
                    <p className='mb-4'>Certain information related to completed transactions, invoices, legal obligations, and regulatory requirements may continue to be retained even after account closure.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Communication Preferences</p>
                    <p className='mb-2'>BayFay may send transactional messages, service updates, payment confirmations, order notifications, customer support communications, promotional offers, newsletters, and marketing messages.</p>
                    <p className='mb-4'>Users may opt out of promotional communications through unsubscribe options provided in such communications or by contacting BayFay support. However, transactional and service-related communications may continue as necessary for service operations.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Children's Privacy</p>
                    <p className='mb-2'>BayFay services are not intended for individuals under the age of 13 years.</p>
                    <p className='mb-4'>BayFay does not knowingly collect personal information from children without appropriate parental or legal guardian consent. If BayFay becomes aware that information relating to a child has been collected unintentionally, reasonable measures will be taken to delete such information.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>International Data Transfers</p>
                    <p className='mb-2'>Your information may be transferred to, processed in, or stored on servers located outside your state, province, or country where data protection laws may differ from those in your jurisdiction.</p>
                    <p className='mb-4'>By accessing or using BayFay services, you consent to such transfers and processing in accordance with this Privacy Policy and applicable laws.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Fraud Prevention and Platform Protection</p>
                    <p className='mb-2'>BayFay may use collected information to detect, investigate, prevent, and address fraud, unauthorized transactions, suspicious activities, policy violations, security incidents, abuse of services, or other harmful activities.</p>
                    <p className='mb-4'>BayFay reserves the right to suspend or restrict accounts involved in fraudulent or unlawful activities.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Links to Third-Party Websites</p>
                    <p className='mb-2'>The Platform may contain links to third-party websites, applications, or services that are not operated or controlled by BayFay.</p>
                    <p className='mb-4'>BayFay is not responsible for the privacy practices, policies, content, or security of third-party websites or services. Users are encouraged to review the privacy policies of such third-party services before sharing information.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Compliance with Laws</p>
                    <p className='mb-4'>BayFay may disclose information where necessary to comply with applicable laws, legal obligations, regulatory requirements, judicial proceedings, governmental requests, law enforcement investigations, or protection of legal rights and public safety.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Changes to this Privacy Policy</p>
                    <p className='mb-2'>BayFay reserves the right to update, modify, or revise this Privacy Policy at any time. Updated versions will be published on this page along with a revised "Last Updated" date.</p>
                    <p className='mb-4'>Continued use of the Platform after updates become effective constitutes acceptance of the revised Privacy Policy.</p>

                    <p className='font-size-1rem font-weight-bold mb-1 mt-3 color-lite-teal-blue'>Grievance Officer</p>
                    <p className='mb-1'>If you have any concerns, complaints, or grievances regarding this Privacy Policy or BayFay's handling of personal information, you may contact:</p>
                    <p className='mb-0 font-weight-bold'>Grievance Officer</p>
                    <p className='mb-0 font-weight-bold'>PICKZY SOFTWARE PRIVATE LIMITED</p>
                    <p className='mb-4'>Email: <a href="mailto:support@bayfay.com" className='color-blue'>support@bayfay.com</a></p>

                </div>
            </div>
        </Aux>
    );
};

export default Privacy;