// Authentication: inputs in every state that matters — focused, filled,
// valid, disabled — plus the one-time code, which is a pattern of its own.

import { Check, Delete, Eye, KeyRound, Lock, Mail, MailCheck } from "lucide-react";
import { AppBar, Wordmark } from "./chrome";
import { reader } from "./content";
import { space } from "./space";

/** Google's "G", drawn in the text color: Index keeps third-party marks monochrome. */
const GoogleMark = () => (
	<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
		<path d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3Z" />
		<path d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
		<path d="M6.4 14a6 6 0 0 1 0-4V7.4H3.1a10 10 0 0 0 0 9.2L6.4 14Z" />
		<path d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6Z" />
	</svg>
);

export function SignIn() {
	return (
		<>
			<AppBar />
			<div className="ax-stack" data-gap="8" style={{ padding: space(12, 24, 0) }}>
				<Wordmark size={20} />
				<span className="ax-title1" style={{ marginTop: space(12) }}>
					Welcome back
				</span>
				<span className="ax-subhead ax-muted">
					Sign in to pick up where you left off.
				</span>
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(28, 24, 0) }}>
				<div className="ax-field" data-state="focused">
					<span className="ax-label">Email</span>
					<span className="ax-control">
						<Mail className="ax-glyph" size={18} strokeWidth={1.9} />
						<span className="ax-value ax-caret">{reader.email}</span>
					</span>
				</div>
				<div className="ax-field">
					<span className="ax-row" data-justify="between">
						<span className="ax-label">Password</span>
						<span className="ax-footnote ax-link">Forgot password?</span>
					</span>
					<span className="ax-control">
						<Lock className="ax-glyph" size={18} strokeWidth={1.9} />
						<span className="ax-placeholder">Your password</span>
						<Eye className="ax-glyph" size={18} strokeWidth={1.9} />
					</span>
				</div>
				<span className="ax-btn" data-size="lg" data-block style={{ marginTop: space(8) }}>
					Sign in
				</span>
			</div>

			<div className="ax-stack" data-gap="12" style={{ padding: space(24, 24, 0) }}>
				<span className="ax-separator-label">or</span>
				<span className="ax-btn" data-variant="outline" data-size="lg" data-block>
					<GoogleMark />
					Continue with Google
				</span>
				<span className="ax-btn" data-variant="outline" data-size="lg" data-block>
					<KeyRound className="ax-glyph" size={20} strokeWidth={1.9} />
					Use a passkey
				</span>
			</div>

			<div className="ax-fill" />
			<span className="ax-subhead ax-muted" style={{ padding: space(0, 24, 48), textAlign: "center" }}>
				New to Index? <span className="ax-link ax-semibold">Create an account</span>
			</span>
		</>
	);
}

export function CreateAccount() {
	return (
		<>
			<AppBar />
			<div className="ax-stack" data-gap="8" style={{ padding: space(12, 24, 0) }}>
				<span className="ax-title1">Create your account</span>
				<span className="ax-subhead ax-muted">It takes a minute. No spam, ever.</span>
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(24, 24, 0) }}>
				<div className="ax-field">
					<span className="ax-label">Name</span>
					<span className="ax-control">
						<span className="ax-value">{reader.name}</span>
					</span>
				</div>
				<div className="ax-field">
					<span className="ax-label">Email</span>
					<span className="ax-control">
						<span className="ax-value">{reader.email}</span>
						{/* Not an ax-glyph: inside a control that would turn it muted. */}
						<Check className="ax-success" size={18} strokeWidth={2.4} />
					</span>
				</div>
				<div className="ax-field" data-state="focused">
					<span className="ax-label">Password</span>
					<span className="ax-control">
						<span className="ax-value ax-caret">••••••••••</span>
						<Eye className="ax-glyph" size={18} strokeWidth={1.9} />
					</span>
					<span className="ax-row" data-gap="12">
						<span className="ax-helper">
							<span className="ax-row ax-success" data-gap="4">
								<Check size={14} strokeWidth={2.6} /> 8+ characters
							</span>
						</span>
						<span className="ax-row ax-helper" data-gap="4">
							<Check size={14} strokeWidth={2.6} /> One number
						</span>
					</span>
				</div>
			</div>

			<div className="ax-stack" data-gap="16" style={{ padding: space(24, 24, 0) }}>
				<span className="ax-choice">
					<span className="ax-checkbox" data-checked>
						<Check size={14} strokeWidth={3} />
					</span>
					<span className="ax-subhead">
						I agree to the <span className="ax-link">Terms</span> and{" "}
						<span className="ax-link">Privacy Policy</span>
					</span>
				</span>
				<span className="ax-choice">
					<span className="ax-checkbox" />
					<span className="ax-stack" style={{ gap: space(2) }}>
						<span className="ax-subhead">Send me the weekly digest</span>
						<span className="ax-footnote ax-muted">Optional. One email on Sundays.</span>
					</span>
				</span>
			</div>

			<div className="ax-fill" />
			<div className="ax-stack" data-gap="16" style={{ padding: space(0, 24, 48) }}>
				<span className="ax-btn" data-size="lg" data-block>
					Create account
				</span>
				<span className="ax-subhead ax-muted" style={{ textAlign: "center" }}>
					Already have an account? <span className="ax-link ax-semibold">Sign in</span>
				</span>
			</div>
		</>
	);
}

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "delete"];

export function Verify() {
	return (
		<>
			<AppBar />
			<div
				className="ax-stack"
				data-gap="16"
				style={{ padding: space(16, 24, 0), alignItems: "center", textAlign: "center" }}
			>
				<span className="ax-empty-media">
					<MailCheck className="ax-glyph" size={28} strokeWidth={1.8} />
				</span>
				<span className="ax-stack" data-gap="8">
					<span className="ax-title1">Check your inbox</span>
					<span className="ax-subhead ax-muted">
						We sent a 6-digit code to{" "}
						<span className="ax-semibold" style={{ color: "var(--ax-content-default)" }}>
							{reader.email}
						</span>
					</span>
				</span>
			</div>

			<div className="ax-otp" style={{ padding: space(28, 0, 0) }}>
				<span className="ax-otp-cell">4</span>
				<span className="ax-otp-cell">8</span>
				<span className="ax-otp-cell">2</span>
				<span className="ax-otp-sep" />
				<span className="ax-otp-cell" data-state="active" />
				<span className="ax-otp-cell" />
				<span className="ax-otp-cell" />
			</div>

			<span className="ax-footnote ax-muted" style={{ padding: space(20, 24, 0), textAlign: "center" }}>
				Didn't get it? <span className="ax-disabled">Resend code in 0:24</span>
			</span>

			<div className="ax-fill" />
			<div style={{ padding: space(0, 24, 16) }}>
				<span className="ax-btn" data-size="lg" data-block data-state="disabled">
					Verify
				</span>
			</div>
			<div className="ax-keypad" data-variant="flat">
				{keys.map((key) =>
					key === "" ? (
						<span key="blank" />
					) : (
						<span key={key} className="ax-key" data-action={key === "delete" ? "" : undefined}>
							{key === "delete" ? <Delete size={24} strokeWidth={1.8} /> : key}
						</span>
					),
				)}
			</div>
		</>
	);
}
