# Profiles

Member and officer profiles are the foundation of the system.
There are two types of profiles: member profiles and officer profiles.

## Officer Profiles

Officer profiles are created by the system administrator. They are used to
authenticate officers, and to track their activity.

The primary difference between member and officer profiles is that officer
profiles have a `role` field. This field is used to determine what permissions
the officer has.

## Member Profiles

Member profiles are created by an officer. Members cannot log in. The sole 
purpose of member profiles is to store information about members.

<seealso>
    <category ref="profiles">
        <a href="Member-Profiles.md" />
        <a href="Officer-Profiles.md" />
    </category>
    <category ref="uh">
        <a href="Admin.md" />
        <a href="Authenticating-Logging-In.md" />
        <a href="Loans.md" />
        <a href="Deposits.md" />
    </category>
    <category ref="ds">
        <a href="Naming.md" />
        <a href="Comments.md" />
        <a href="Code-Style.md" />
        <a href="Git-Commit-Messages.md" />
        <a href="Vue.md"></a>
    </category>
</seealso>
