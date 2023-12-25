# Loan Dashboard

The first thing you see once you enter the website is the ___Loan Dashboard___. This page houses all loans found in the database that are accepted.

Each row contains information on a certain loan. Information present are:
- Type of Loan
- Loanee; A button that can forward the user to the loanee's profile.
- Original Amount of Loan
- Outstanding Balance
- Status
- Due Date

## Sorting, Filtering, and Searching

Additionally, loans are sorted firstly by ___status___, then by ___due date___. Adding your own sort is possible by clicking the header of the certain field you would like to toggle. An arrow would then appear, pointing up for ascending, and pointing down for descending. Clicking the header once again would remove the sorting of that specific header. Also, the search bar found on the top left of the loans table can help filter specific fields you wish to search.

## Signifiers

The ___status___ and ___due date___ both have colors that signify a certain status.

### Status

For ___status___, the colors are as follows:

- Pending: <span style="color:purple;">`purple`</span>,
- Approved (for release): <span style="color:orange;">`orange`</span>,
- Approved (released): <span style="color:green;">`green`</span>,
- Rejected: <span style="color:red;">`red`</span>,
- Complete: <span style="color:blue;">`blue`</span>.

### Due Date

For ___due date___, this corresponds with the colors found in the settings tab (only accessible by the ___admin___). The colors are as follows:

- Demand Letter: <span style="color:red;">`red`</span>,
- Third Notice: <span style="color:orange;">`orange`</span>,
- Second Notice: <span style="color:blue;">`blue`</span>.
- First Notice: <span style="color:purple;">`purple`</span>,
- Reminder: <span style="color:gray;">`gray`</span>,

The amount of days for these colors to pop us as well is depending on the settings the ___admin___ has decided to put.

> [Adding a payment transaction](Adding-Loan-Ledger-Transaction.md) will have the loan considered
> as **paid** for the current period. Within 5 to 15 minutes of the transaction, the loan's due date
> will be updated to the next period.

## Accessing the Loan Ledger

To access the loan ledger of a specific loan, find the loan to view, navigate to the rightmost part of the loan's row and find the arrow. This will forward you to the loan's ledger page.

<seealso>
    <category ref="loans">
        <a href="Creating-a-Loan-Application.md" />
        <a href="Loan-Approval-Rejection.md" />
        <a href="Loan-Ledger.md" />
    </category>
    <category ref="uh">
        <a href="Admin.md" />
        <a href="Authenticating-Logging-In.md" />
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
