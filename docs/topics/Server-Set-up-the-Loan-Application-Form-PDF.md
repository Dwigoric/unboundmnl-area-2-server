# Server: Set up the Loan Application Form PDF

In order to be able to create loan applications, you must first set up the loan
application form PDF on the server.

It is recommended to use the latest version of Adobe Acrobat Pro to set up the
form as a fillable PDF.

The created PDF must be placed in the server's `private` directory with the
filename `%loan-app-form-filename%`.

## Form Fields

Make sure the form fields are named exactly as they are in the table below.
Otherwise, the loan application form will not work.
Place the form fields correctly in the PDF.

The following are the fields that must be included in the loan application form:

| Field Name                               | Type      | Description                                      |
|------------------------------------------|-----------|--------------------------------------------------|
| `Date`                                   | Text      | The date the loan application was created.       |
| `New`                                    | Checkbox  | Check this if the loan application is new.       |
| `Renewal`                                | Checkbox  | Check this if the loan application is a renewal. |
| `Term of Loan`                           | Text      | The term of the loan.                            |
| `Amount`                                 | Text      | The amount of the loan.                          |
| `Emergency`                              | Checkbox  | Check this if the loan is an emergency loan.     |
| `Multi-Purpose`                          | Checkbox  | Check this if the loan is a multi-purpose loan.  |
| `Educational`                            | Checkbox  | Check this if the loan is an education loan.     |
| `Petty Cash`                             | Checkbox  | Check this if the loan is a petty cash loan.     |
| `Commercial`                             | Checkbox  | Check this if the loan is a commercial loan.     |
| `Livelihood`                             | Checkbox  | Check this if the loan is a livelihood loan.     |
| `Surname`                                | Text      | The member's surname.                            |
| `Given Name`                             | Text      | The member's first name.                         |
| `Middle Name`                            | Text      | The member's middle name.                        |
| `Date of Birth`                          | Text      | The member's date of birth.                      |
| `Age`                                    | Text      | The member's age.                                |
| `Place of Birth`                         | Text      | The member's place of birth.                     |
| `Male`                                   | Checkbox  | Check this if the member is a male.              |
| `Female`                                 | Checkbox  | Check this if the member is a female.            |
| `Civil Status`                           | Text      | The member's civil status.                       |
| `TIN`                                    | Text      | The member's TIN.                                |
| `Contact No`                             | Text      | The member's contact number.                     |
| `Residence Address`                      | Text      | The member's residence address.                  |
| `Monthly Income`                         | Text      | The member's monthly income.                     |
| `Source of Income`                       | Text      | The member's source of income.                   |
| `Spouse Surname`                         | Text      | The member's spouse's surname.                   |
| `Spouse Given Name`                      | Text      | The member's spouse's first name.                |
| `Spouse Middle Name`                     | Text      | The member's spouse's middle name.               |
| `Spouse Date of Birth`                   | Text      | The member's spouse's date of birth.             |
| `Spouse Place of Birth`                  | Text      | The member's spouse's place of birth.            |
| `Spouse Age`                             | Text      | The member's spouse's age.                       |
| `Spouse Source of Income`                | Text      | The member's spouse's source of income.          |
| `Spouse Contact No`                      | Text      | The member's spouse's contact number.            |
| `Coborrower Surname`                     | Text      | The coborrower's surname.                        |
| `Coborrower Given Name`                  | Text      | The coborrower's first name.                     |
| `Coborrower Middle Name`                 | Text      | The coborrower's middle name.                    |
| `Coborrower Date of Birth`               | Text      | The coborrower's date of birth.                  |
| `Coborrower Place of Birth`              | Text      | The coborrower's place of birth.                 |
| `Coborrower Age`                         | Text      | The coborrower's age.                            |
| `Coborrower Source of Income`            | Text      | The coborrower's source of income.               |
| `Coborrower Contact No`                  | Text      | The coborrower's contact number.                 |
| `Coborrower Signature Over Printed Name` | Signature | The coborrower's signature over printed name.    |
| `Borrower Signature Over Printed Name`   | Signature | The member's signature over printed name.        |