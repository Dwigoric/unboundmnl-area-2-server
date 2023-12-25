# Loan and Deposit Settings

Accessible only to the Admin, the Loan and Deposit Settings provide the automation for the interest in both the loans and deposits. Each and every type of loan and type of deposit can be configured in this page.

<img src="loan-and-deposit-settings.png" alt="Loan and Deposit Settings screenshot" />

The interest rate of both loans and deposits as well as the initial deductions in loans can be toggled as a percentage of the loan or deposit amount or as a fixed value.

<img src="interest-rate.png" alt="Loan and Deposit Settings screenshot" />

The initial deductions are also toggleable in the sense that only the ones checked off will be activated despite there being values in the other initial deduction fields.

<img src="initial-deductions-toggle.png" alt="Loan and Deposit Settings screenshot" />

In such cases that the initial deductions have both a  percentage and fixed . The cumulative initial deduction would be the (original loan amount * percent deduction) + fixed deduction. For example, a loan worth 5000 pesos has a 5% Service Fee and a 100 pesos Capital Build Up Fee. The initial deduction would then be equal to (5000 * 0.05) + 100 which is equivalent to 350 pesos. 

Apart from which, the frequency of the interest is toggleable among days, weeks, and months. So interest can be gained daily, weekly, or monthly. 

<img src="interest-toggle.png" alt="Loan and Deposit Settings screenshot" />

Changing the settings is very simple, simply change the interest rate and the frequency as needed. Toggle on or off the necessary intiial deductions and submit. Keep in mind that the loans made prior to the setting change will be unaffected and only loans that are made after the change will follow the new settings. 





<seealso>
    <category ref="admin">
        <a href="Changing-Password.md" />
        <a href="Notification-Settings.md" />
    </category>
    <category ref="uh">
        <a href="Authenticating-Logging-In.md" />
        <a href="Loans.md" />
        <a href="Deposits.md" />
        <a href="Profiles.md" />
    </category>
    <category ref="ds">
        <a href="Naming.md" />
        <a href="Comments.md" />
        <a href="Code-Style.md" />
        <a href="Git-Commit-Messages.md" />
        <a href="Vue.md"></a>
    </category>
</seealso>
