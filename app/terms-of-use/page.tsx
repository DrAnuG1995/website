import LegalPage from "@/components/LegalPage";
export const metadata = { title: "Terms of Use, StatDoctor" };

export default function Page() {
  return (
    <LegalPage title="Terms of Use" eyebrow="Legal · Updated April 2026">
      <p>
        These Terms govern your use of the StatDoctor platform (the &ldquo;Service&rdquo;). By creating an account or
        using the Service you agree to these Terms.
      </p>
      <h2>Who can use StatDoctor</h2>
      <p>
        Doctors with current AHPRA registration who hold appropriate indemnity cover. Hospitals, clinics, and
        other healthcare facilities operating in Australia that are authorised to engage locum medical staff.
      </p>
      <h2>Your account</h2>
      <p>
        You&apos;re responsible for the information you provide and for keeping your login secure. False credentials
        or impersonation will result in immediate account termination and may be reported to AHPRA.
      </p>
      <h2>Shift bookings</h2>
      <p>
        A shift booking is a direct contract between the doctor and the hospital. StatDoctor facilitates the
        match but is not a party to the engagement. Cancellation terms are set by the hospital at time of posting
        and are visible before you apply.
      </p>
      <h2>Fees</h2>
      <p>
        Doctors: free, now and always. We never take a percentage of your earnings. Hospitals: pay a flat
        platform fee per confirmed shift. The fee is shown before you post.
      </p>
      <h2>Credentialing</h2>
      <p>
        We verify AHPRA registration and indemnity cover, but it remains your responsibility to ensure all your
        credentials are current and accurate.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        Nothing in these Terms excludes consumer guarantees under the Australian Consumer Law. Subject to that,
        our liability for any claim is limited to fees paid in the 12 months before the claim arose.
      </p>
      <h2>Changes</h2>
      <p>
        We&apos;ll email you at least 30 days before material changes take effect. Continued use after the change
        date constitutes acceptance.
      </p>
      <h2>Contact</h2>
      <p>
        <a className="link-underline text-ocean" href="mailto:Admin@statdoctor.net">Admin@statdoctor.net</a>
      </p>
    </LegalPage>
  );
}
