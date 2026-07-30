import React, { useEffect } from 'react';
import Aux from "../../utils/auxilary";
import CustomHeader from "../../components/CustomHeader/CustomHeader";

const MerchantHelp = () => {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return (
        <Aux>
            <CustomHeader title={'MERCHANT HELP'} />
            <div className='d-flex justify-content-center static-page-bg'>
                <div className='max-width-1000px w-100 font-size-3 py-2'>
                    <h2 className='help-title'>Help</h2>
                    <div className='help-description'>Here are the solutions for the general queries!</div>
                    <div className='help-container'>
                        <div className="tabAccorion">
                            <div className="accordion" id="accordionExample">
                                <div className="faq-head">
                                    <h2 className="color-white">Merchant</h2>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="heading1">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse1"
                                            aria-expanded="false">
                                            How to Create Additional Shops?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse1" className="collapse" aria-labelledby="heading1"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Tap on <b>Add Store</b> button on the top right corner of Stores
                                                    screen.</p></li>
                                                <li><p>Select your store type and store category. If your shop category
                                                    is
                                                    not available in the dropdown then select <b>Others</b> and provide
                                                    a
                                                    brief description of your shop (For other category shops, our sales
                                                    team
                                                    will contact you and help you to setup the store).</p></li>
                                                <li><p>Enter your <b>Primary Mobile number</b> and verify it by tapping
                                                    the
                                                    Verify button on the right.</p></li>
                                                <li><p>Fill your Shop name in <b>Store or Business Name</b>.</p></li>
                                                <li><p>Select your <b>Store Address</b> by tapping the Location button
                                                    and
                                                    select Country, State, City and Pincode.</p></li>
                                                <li><p>Upload at least 1 image of your Store front image by tapping the
                                                    camera icon.</p></li>
                                                <li><p>Select <b>Product Replacement, Refund within days</b> and <b>Maximum
                                                    delivery distance</b> based upon your shop delivery capacity.</p>
                                                </li>
                                                <li><p>Select your Shop <b>Delivery timing</b> by clicking the clock
                                                    icons.
                                                </p></li>
                                                <li><p>Select <b>Delivery Methods, Delivery Charges, Cash on Delivery
                                                    Limit</b> (if any) and <b>Shop availability</b> days.</p></li>
                                                <li><p>You can enable/disable <b>Other Locations</b> delivery as per
                                                    shop
                                                    delivery policy.</p></li>
                                                <li><p>If you don’t wish to open Private shop disable the <b>Enable
                                                    Private
                                                    Shop</b> option and accept the Terms of service and privacy policy
                                                    and
                                                    Click on <b>Create Account</b>.</p></li>
                                                <li><p><b>Note :</b> If you disable <b>Enable Private Shop</b> option,
                                                    then
                                                    your shop will appear only under Public Shop in the BayFay Customer
                                                    Application.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="heading2">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse2"
                                            aria-expanded="false">
                                            How to Manage Inventory?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse2" className="collapse" aria-labelledby="heading2"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <h5>Unapproved</h5>
                                            <p> – The products which are added in Inventory and yet to be approved by
                                                BayFay.</p>
                                            <h5>Live </h5>
                                            <p>– The Products which are approved by BayFay and are ongoing and ready to
                                                purchase.</p>
                                            <p><b>Inventory &gt; Unapproved</b></p>
                                            <h5>1. Unapproved</h5>
                                            <p>Tap on the Add Product button (on the bottom right) to add products, now
                                                you
                                                can see four options:</p>
                                            <p>1. Add new product  &nbsp;   2. Scan  &nbsp;   3. SKU
                                                Product   &nbsp;  4.
                                                UPC Product.</p>
                                            <h6>1. Add new product:</h6>
                                            <p>By selecting the Add New Product you can register the product details
                                                manually. After entering the details then click on ‘Submit for review’.
                                                The
                                                product is now added in Inventory but BayFay have to approve the Product
                                                in
                                                order to go live to purchase.</p>
                                            <h6>2. Scan:</h6>
                                            <p>You can add a new Product by selecting Scan option and you have to scan
                                                the
                                                QR code/Barcode of the product or you can enter the UPC/EAN/SKU
                                                number.</p>
                                            <h6>3. UPC Product:</h6>
                                            <p>By selecting the UPC Product you can download UPC template (.csv file) to
                                                your system by selecting the option Download. Fill the required details
                                                about the product in .csv template file and upload the same file by
                                                selecting the option Upload.</p>
                                            <p>[UPC (Universal Product Code) consists of 12 numeric digits that are
                                                uniquely
                                                assigned to each trade item. UPC is the barcode mainly used for scanning
                                                of
                                                trade items at the point of sale, per GS1 specifications. UPC makes it
                                                easy
                                                to identify product features such as the brand name, type, size, color
                                                etc.]</p>
                                            <h6>4. SKU Product:</h6>
                                            <p>By selecting SKU Product you can download SKU template (.csv file) to
                                                your
                                                system by selecting Download. Fill the required details about the
                                                product in
                                                .csv template file and upload the same file by selecting Upload.</p>
                                            <p>[ SKU (Stock Keeping Unit) represent merchant’s own product and is a
                                                machine-readable Barcode that is most often printed on product labels
                                                and is
                                                a unique identifier that lets vendors expeditiously scan and track the
                                                movement of inventory.]</p>
                                            <p><b>Note:</b>If any required field info or Image is not yet updated then
                                                the
                                                status of the Product will be in ‘Draft’ once all the required details
                                                are
                                                updated then the Product status changes to ‘Waiting for review’. Once
                                                approved by Admin the product goes Live.</p>
                                            <p><b>Inventory &gt; Live</b></p>
                                            <h5>2. Live</h5>
                                            <p>You can view the list of all ongoing products and its information.</p>
                                            <p>To update the list of products information tap on <b>Upload</b> button,
                                                now
                                                you can see three options:</p>
                                            <p><b>1. Scan &nbsp;  2. UPC Product  &nbsp;  3. SKU Product.</b></p>
                                            <h6>1. Scan:</h6>
                                            <p>You can update the product information by Selecting Scan option and you
                                                have
                                                to scan the QR code/Barcode of the product or you can enter the UPC/SKU
                                                number.</p>
                                            <h6>2. UPC Product:</h6>
                                            <p>By selecting the UPC Product you can download UPC template (.csv file) to
                                                your system by selecting the Download option. Fill the required details
                                                about the product in .csv template file and upload the same file by
                                                selecting the option Upload.</p>
                                            <h6>3. SKU Product:</h6>
                                            <p>By selecting the SKU Product you can download SKU template (.csv file) to
                                                your system by selecting the option Download. Fill the required details
                                                about the product in .csv template file and upload the same file by
                                                selecting the option Upload.</p>
                                            <h6>Live &gt; BULK UPLOAD LOG option:</h6>
                                            <p>You can select <b>BULK UPLOAD LOG</b> to view the Log History of
                                                uploaded/updated product information and you can download the Log by
                                                tapping
                                                the Download button and send the Log to your mail if needed.</p>
                                            <h6>Live &gt; EDIT option:</h6>
                                            <p>To update a Product Information tap on <b>EDIT</b> option, now you can
                                                edit
                                                the product detail like increase/decrease the stocks and price or delete
                                                the
                                                product from Inventory.</p>
                                            <h6>Live &gt; FILTER option:</h6>
                                            <p>You can categorize the Products by selecting FILTER option, Products can
                                                be
                                                categorized based on Low Stock, High Stock, UPC and SKU.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading3">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse3"
                                            aria-expanded="false">
                                            How to Manage Shop Settings?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse3" className="collapse" aria-labelledby="heading3"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>To update your Shop Delivery Settings go to Shop
                                                    Settings &gt; Shop
                                                    delivery settings and make the changes you wish to make and tap the
                                                    Save
                                                    button.</p></li>
                                                <li><p>To Open/Close your Shop go to Shop Settings and enable/disable
                                                    the
                                                    Shop Open/Close toggle button.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="heading4">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse4"
                                            aria-expanded="false">
                                            How to Manage Orders?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse4" className="collapse" aria-labelledby="heading4"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <h6>1. New Orders:</h6>
                                            <ol>
                                                <li><p>You can check the order details and customer contact information
                                                    of
                                                    new orders by tapping the arrow(&gt;) button.</p></li>
                                                <li><p>To accept orders tap on Accept button and give merchant expected
                                                    delivery date &amp; time and tap on Accept button.</p></li>
                                                <li><p>Now you can see the accepted orders in Packaging tab.</p></li>
                                            </ol>

                                            <p><b>Note: You can check the Undelivered/Replacement request orders also in
                                                New
                                                Orders tab.</b></p>

                                            <ol>
                                                <li><p>You can refund the amount by tapping on the <b>Refund</b> button
                                                    if
                                                    you don’t wish to accept Replacement/Undelivered request.</p></li>
                                                <li><p>You can escalate the Order/Product by tapping on
                                                    the <b>Escalate</b> button if you don’t wish to provide
                                                    refund/replacement for the product or order.</p></li>
                                                <li><p>You can accept the Replacement/Undelivered requested
                                                    Order/Product by
                                                    tapping the <b>Accept</b> button. This order will be processed as a
                                                    new
                                                    order with new order id.</p></li>
                                            </ol>

                                            <h6>2. Packaging:</h6>
                                            <ol>
                                                <li>You can dispatch the product after giving the MFG and EXP date of
                                                    the
                                                    product by scanning the product Barcode or QR code.
                                                </li>
                                            </ol>

                                            <p><b>Note: MFG date of the product is not mandatory, but the EXP date of
                                                the
                                                product should be selected if applicable. If not applicable, select
                                                Unknown
                                                or Not Applicable.</b></p>

                                            <h6>3. Dispatched:</h6>

                                            <p>a. You can start delivery by tapping the <b>Start Delivery</b> button at
                                                the
                                                bottom.</p>

                                            <h6>4. On the way:</h6>

                                            <p>a. Here you can find all <b>Delivery By Shop</b> orders and also you can
                                                check the map location of the customer by tapping on the map button.</p>
                                            <p>b. You can deliver the order by tapping the Delivered button at the top
                                                right
                                                corner.</p>

                                            <h6>5. Delivered:</h6>

                                            <p>a. In the Delivered tab, you will find all your delivered orders.</p>
                                            <p>b. You can check the order details, customer verification status and
                                                customer
                                                rating by tapping the arrow(&gt;) button.</p>

                                            <h6>6. Replace/Refund:</h6>

                                            <p>a. Here you can see all Replacement/Undelivered request orders.</p>
                                            <p>b. You can check the order details and product status by tapping the
                                                arrow(&gt;) button.</p>
                                            <h6>7. Cancelled:</h6>
                                            <p>a. Here you can see all orders cancelled by Shop, Customer and
                                                BayFay.</p>
                                            <p><b>Note: If you can’t process/deliver any order due to unavoidable
                                                reasons,
                                                you can cancel it by clicking the Cancel button on the New Orders,
                                                Packaging, Dispatched or On the way tabs.</b></p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="heading5_2">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse5_2"
                                            aria-expanded="false">
                                            Manage how you get paid?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse5_2" className="collapse" aria-labelledby="heading5_2"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <p><b>To add your Bank Account Information:</b></p>

                                            <ul>
                                                <li>Go to Menu and select <b>Get Paid</b></li>
                                                <li>Tap <b>Add Method</b> button.</li>
                                                <li>Enter your Bank Account details and tap on Add Account.</li>
                                            </ul>

                                            <p>For security reasons, your new payment method will become active in three
                                                calendar days. Be sure to double check your account number(s) and
                                                details
                                                carefully. Accurate entry of these details is your responsibility and
                                                essential for successful withdrawals. Consider setting up a second
                                                payment
                                                method as a backup, just in case your first one isn't available for some
                                                reason. You can add as many as you want and make changes as needed.</p>

                                            <h6>To Withdraw Your Earnings:</h6>

                                            <ul>
                                                <li>Go to Menu and select <b>Get Paid</b></li>
                                                <li>Tap the Get Paid button.</li>
                                                <li><p>Enter/Select the amount to withdraw.</p></li>
                                                <li><p>Tap Get Paid Now button.</p></li>
                                            </ul>

                                            <h6>To schedule for Auto Payment/Auto Schedule:</h6>

                                            <ul>
                                                <li><p>Go to Menu and select <b>Get Paid</b>.</p></li>
                                                <li><p>Tap on <b>Edit Schedule</b> button.</p></li>
                                                <li><p>Select Bank account/Payment method and Preferred Payment
                                                    Schedule.</p></li>
                                                <li><p>Select the balance from Dropdown when the auto schedule will
                                                    process
                                                    and tap on Save button.</p></li>
                                            </ul>

                                            <h6>To Remove Payment Method/Bank Account:</h6>

                                            <ul>
                                                <li><p>Go to Menu and select Get Paid.</p></li>
                                                <li><p>Tap on the <b>Remove</b> button of account and tap Yes button on
                                                    confirmation popup.</p></li>
                                            </ul>

                                            <h6>To check the Payment History:</h6>

                                            <ul>
                                                <li><p>Go to Menu and select Get Paid.</p></li>
                                                <li><p>Tap on Payment History button.</p></li>
                                            </ul>

                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="heading5">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse5"
                                            aria-expanded="false">
                                            How to create users?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse5" className="collapse" aria-labelledby="heading5"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Tap on Menu and select Users.</p></li>
                                                <li><p>Tap on the Create User button to create a new user.</p></li>
                                                <li><p>Fill User Name, Employee id, Designation, Mobile Number, Email id
                                                    and
                                                    Password.</p></li>
                                                <li><p>Select the Notification method by which the user would like to be
                                                    notified and enter Description about that user and tap on the Create
                                                    User button.</p></li>
                                                <li><p>You can assign the Stores by tapping the Stores button and roles
                                                    by
                                                    tapping Roles button.</p></li>
                                                <li><p>You can Suspend/Unsuspend and Delete the user by tapping
                                                    on <b>Edit</b> button.</p></li>
                                                <li><p>You can also edit the details of the user using Edit option.</p>
                                                </li>
                                                <li><p>You must verify the user’s Mobile Number before logging in.</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header" id="heading6">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse6"
                                            aria-expanded="false">
                                            How to create Roles?<i className="fa fa-plus" /><i className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse6" className="collapse" aria-labelledby="heading6"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Tap on Menu and select Roles.</p></li>
                                                <li><p>You will find predefined roles like Super Admin, Manager,
                                                    Accounts,
                                                    Delivery, Supervisor and Staff</p></li>
                                                <li><p>Tap on <b>Create Role</b> button to create a new role.</p></li>
                                                <li><p>Fill the <b>Role Name, Description</b> and tap on <b>Create
                                                    Role</b> button.</p></li>
                                                <li><p>In the next screen, you can select privileges for that user as
                                                    per
                                                    your shop policy.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading7">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse7"
                                            aria-expanded="false">
                                            How can I reset my password?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse7" className="collapse" aria-labelledby="heading7"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>If you have forgotten your password, tap on the Forgot Password
                                                    option on the Merchant Login screen.</p></li>
                                                <li><p>Enter your registered mobile number and the OTP received on your
                                                    mobile number.</p></li>
                                                <li><p>Create your New Password and tap the Update button.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading8">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse8"
                                            aria-expanded="false">
                                            How to update User/Merchant Profile?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse8" className="collapse" aria-labelledby="heading8"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Tap on Menu and select Settings.</p></li>
                                                <li><p>In Profile Settings, you can update your Mobile Number, Profile
                                                    Picture, Password and Email.</p></li>
                                                <li><p>In Notifications, you can change your Notification
                                                    preferences.</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading9">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse9"
                                            aria-expanded="false">
                                            How to check my Billing History?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse9" className="collapse" aria-labelledby="heading9"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to Menu and select Billings..</p></li>
                                                <li><p>Here you can check your Transaction History, Balance, Pending
                                                    Credits, Pending Debits, Total Debits and Total Credits.</p></li>
                                                <li><p>You can check Transaction details by tapping on <b>Invoice</b>.
                                                </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading10">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse10"
                                            aria-expanded="false">
                                            How to check my Order History?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse10" className="collapse" aria-labelledby="heading10"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to Menu and select History.</p></li>
                                                <li><p>Here you can check your all orders.</p></li>
                                                <li><p>You can check the order details by tapping the arrow (&gt;)
                                                    button.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading11">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse11"
                                            aria-expanded="false">
                                            How to view your sales report?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse11" className="collapse" aria-labelledby="heading11"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>In the Overview screen, you can have complete analytics about
                                                    your
                                                    business through BayFay by checking No. of users visited your shop,
                                                    No.
                                                    of orders Placed, Replaced, Cancelled and your Total Sales
                                                    Amount.</p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading12">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse12"
                                            aria-expanded="false">
                                            How to communicate with customers?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse12" className="collapse" aria-labelledby="heading12"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>The Orders/Products which have been escalated by you in the New
                                                    Orders tab will appear in the Messages tab. You can have a
                                                    Conversation
                                                    with the Customer to resolve any issues regarding Order/Product
                                                    Replacement/Refund.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading13">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse13"
                                            aria-expanded="false">
                                            How to create and share Shop promotion URL?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse13" className="collapse" aria-labelledby="heading13"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>To <b>create and share shop promotion URL</b> go to <b>Shop
                                                    Settings</b>.</p></li>
                                                <li><p>Go to <b>Promote Your Shop</b>.</p></li>
                                                <li><p>Enter the shop username and check the availability if the
                                                    username is
                                                    available tap on <b>Save</b> button.</p></li>
                                                <li><p>Now you can share or copy the shop promotion URL.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading14">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse14"
                                            aria-expanded="false">
                                            What is Payment Protection?<i className="fa fa-plus" /><i
                                                className="fa fa-minus" />
                                        </h5>
                                    </div>
                                    <div id="collapse14" className="collapse" aria-labelledby="heading14"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>BayFay will protect the customers payment and provide limited
                                                    days
                                                    replacement warranty(until delivery +7days).</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading15">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse15"
                                            aria-expanded="false">
                                            How to send the offer to customers on Manage Customers?<i
                                                className="fa fa-plus"></i>
                                        </h5>
                                    </div>
                                    <div id="collapse15" className="collapse" aria-labelledby="heading15"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo Code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Select the customers in <b>Existing Customers</b> or <b>New
                                                    Customers</b> tab.</p></li>
                                                <li><p>Tap on Send Offer button.</p></li>
                                                <li><p>Select Store, Promo Code, Message Type and Message Template.</p>
                                                </li>
                                                <li><p>Tap on Submit Request button.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading16">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse16"
                                            aria-expanded="false">
                                            How to check message status on Manage Customer?<i
                                                className="fa fa-plus"></i>
                                        </h5>
                                    </div>
                                    <div id="collapse16" className="collapse" aria-labelledby="heading16"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo Code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Tap on <b>Message Box</b> button.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading17">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse17"
                                            aria-expanded="false">
                                            How to edit/check the Draft/In Review messages on Manage Customer?<i
                                                className="fa fa-plus"></i>
                                        </h5>
                                    </div>
                                    <div id="collapse17" className="collapse" aria-labelledby="heading17"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo Code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Tap on <b>Message Box</b> button.</p></li>
                                                <li><p>Tap on the arrow button of <b>Draft/In Review</b> message.</p>
                                                </li>
                                                <li><p>Now you can edit the message and submit.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading18">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse18"
                                            aria-expanded="false">
                                            How to sync mobile contacts on Manage Customer?<i
                                                className="fa fa-plus"></i>
                                        </h5>
                                    </div>
                                    <div id="collapse18" className="collapse" aria-labelledby="heading18"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo Code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Go to <b>New Customers</b> tab.</p></li>
                                                <li><p>Tap on the add button and select <b>Sync Contacts from
                                                    Phone</b> option.</p></li>
                                                <li><p>Now your phone contacts will synchronize.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading19">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse19"
                                            aria-expanded="false">
                                            How to Download/Upload contacts template in Manage Customer?<i
                                                className="fa fa-plus"></i>
                                        </h5>
                                    </div>
                                    <div id="collapse19" className="collapse" aria-labelledby="heading19"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo Code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Go to <b>New Customers</b> tab.</p></li>
                                                <li><p>Tap on the add button and select <b>Upload Contacts</b> option.
                                                </p>
                                                </li>
                                                <li><p>Select <b>Download Template</b> option to download contact
                                                    template.
                                                </p></li>
                                                <li><p>Select <b>Upload Contacts</b> option to upload contact template.
                                                </p>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading20">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse20"
                                            aria-expanded="false">
                                            How to purchase the SMS/Push/Email package in Manage Customer?<i
                                                className="fa fa-plus"></i>
                                        </h5>
                                    </div>
                                    <div id="collapse20" className="collapse" aria-labelledby="heading20"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Select the customers in Existing Customers or New Customers
                                                    tab.</p>
                                                </li>
                                                <li><p>Tap on <b>Send Offer</b> button.</p></li>
                                                <li><p>Tap on the <b>Buy Package</b> button in the Promotion screen.</p>
                                                </li>
                                                <li><p>Select the package and tap on <b>Make Payment</b> button.</p>
                                                </li>
                                                <li><p>Select a payment option and make payment.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading21">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse21"
                                            aria-expanded="false">
                                            How to create a new SMS/Push template in Manage Customer?<i
                                                className="fa fa-plus"></i>
                                        </h5>
                                    </div>
                                    <div id="collapse21" className="collapse" aria-labelledby="heading21"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo Code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Select the customers in <b>Existing Customers</b> or <b>New
                                                    Customers</b> tab.</p></li>
                                                <li><p>Tap on <b>Send Offer</b> button.</p></li>
                                                <li><p>Select SMS/Push checkbox.</p></li>
                                                <li><p>Tap on <b>Select </b> button of Push &amp; SMS template.</p></li>
                                                <li><p>Tap on ‘New’ button at the top right corner.</p></li>
                                                <li><p>Fill Template Name &amp; Message.</p></li>
                                                <li><p>Tap on <b>Submit</b> button.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading22">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse22"
                                            aria-expanded="false">
                                            How to create new Email template in Manage Customer?<i
                                                className="fa fa-plus"></i>
                                        </h5>
                                    </div>
                                    <div id="collapse22" className="collapse" aria-labelledby="heading22"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo Code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Select the customers in Existing Customers or New Customers
                                                    tab.</p>
                                                </li>
                                                <li><p>Tap on <b>Send Offer</b> button.</p></li>
                                                <li><p>Select Email checkbox.</p></li>
                                                <li><p>Tap on <b>Select</b> button of Email template.</p></li>
                                                <li><p>Tap on ‘New’ button at the top right corner.</p></li>
                                                <li><p>Fill Email Title, Select Template Format, Fill Email Subject and
                                                    Description.</p></li>
                                                <li><p>Tap on ‘Add Product’ button.</p></li>
                                                <li><p>Select the products and tap on ‘Choose Products’ button.</p></li>
                                                <li><p>Tap on <b>Submit</b> button.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header" id="heading23">
                                        <h5 className="mb-0 collapsed" data-toggle="collapse" data-target="#collapse23"
                                            aria-expanded="false">
                                            How to delete customers in New Customers tab in Manage Customer?<i
                                                className="fa fa-plus" />
                                        </h5>
                                    </div>
                                    <div id="collapse23" className="collapse" aria-labelledby="heading23"
                                        data-parent="#accordionExample">
                                        <div className="card-body">
                                            <ul>
                                                <li><p>Go to <b>Promo Code</b> and select <b>Manage Customers</b>.</p>
                                                </li>
                                                <li><p>Go to <b>New Customers</b> tab.</p></li>
                                                <li><p>Select customers and tap on the delete button.</p></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Aux>
    );
};

export default MerchantHelp;
