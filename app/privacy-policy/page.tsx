import LegalPage from "@/components/LegalPage";
export const metadata = { title: "Privacy Policy — StatDoctor" };

export default function Page() {
  return (
    <LegalPage title="Privacy Policy" eyebrow="Legal · Updated April 2026">
      <p>
        StatDoctor Pty Ltd (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what personal
        information we collect, how we use it, and the choices you have. It&apos;s written to comply with the
        Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth).
      </p>
      <h2>What we collect</h2>
      <p>
        When you create a StatDoctor account we collect your name, contact details, AHPRA registration number,
        specialty, and credentials (CV, indemnity cover, certificates). When you book a shift we collect shift
        history, ratings, and payment details. We also collect device and usage data (IP, app version, crash
        logs) to keep the app running safely.
      </p>
      <h2>How we use it</h2>
      <p>
        To match you with appropriate shifts, verify credentials, process payments, prevent fraud, and improve
        the product. We do not sell your data, ever. We do not share your personal information with agencies.
      </p>
      <h2>Who we share it with</h2>
      <p>
        Hospitals you apply to see your credentials and rating. Our payment processor (Stripe) receives the
        minimum data needed to pay you. AHPRA verification partners receive your registration number to confirm
        active status.
      </p>
      <h2>How we store it</h2>
      <p>
        On encrypted Australian-based servers. Credentials are stored only as long as you hold an active account,
        plus seven years as required by medical record retention law.
      </p>
      <h2>Your rights</h2>
      <p>
        You can access, correct, or delete your data at any time by emailing{" "}
        <a className="link-underline text-ocean" href="mailto:privacy@statdoctor.net">privacy@statdoctor.net</a>. We&apos;ll respond within 30 days.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Reach the privacy officer at{" "}
        <a className="link-underline text-ocean" href="mailto:privacy@statdoctor.net">privacy@statdoctor.net</a>.
      </p>
    </LegalPage>
  );
}
