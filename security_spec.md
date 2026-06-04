# Security Specification: Secure Lending Portal

## 1. Data Invariants
- A Loan must always be linked to a valid `borrowerId` matching the authenticated user.
- Payments cannot be created or modified by the borrower (system-only or admin).
- Notifications can only be marked as 'read' by the recipient.
- Users cannot escalate their own roles (e.g., from 'borrower' to 'admin').

## 2. The "Dirty Dozen" Payloads (Deny Targets)
1. **Identity Theft**: Create a loan with `borrowerId` of another user.
2. **Privilege Escalation**: Update user profile to set `role: 'admin'`.
3. **Ghost Loan**: Create a loan without an `amount`.
4. **ID Poisoning**: Use a 2KB string as a loan ID.
5. **PII Leak**: Read another user's profile metadata.
6. **State Skip**: Update a `pending` loan directly to `completed`.
7. **Negative Loan**: Request a loan for $-10,000.
8. **Unauthorized Read**: List all loans in the system without filtering by `borrowerId`.
9. **Notification Hijack**: Mark someone else's notification as read.
10. **Shadow Update**: Add `isVerified: true` to a loan payload.
11. **Time Spoof**: Set `applicationDate` to a future year manually.
12. **Orphaned Write**: Create a payment for a non-existent loan ID.

## 3. Test Runner (Summary)
The `firestore.rules` will be verified against these payloads using the rules validator.
