// Orbit — a feed and a profile. The chattiest theme test: avatars, badges,
// counters, a composer and a notification list all in one accent.

import {
	Bell,
	Heart,
	Home,
	Image as ImageIcon,
	MessageCircle,
	Repeat2,
	Search,
	Send,
	Share,
	UserPlus,
	Users,
} from "lucide-react";
import { DeviceFrame } from "../DeviceFrame";

const posts = [
	{
		name: "Kai Jensen",
		handle: "@kaij · 2h",
		initials: "KJ",
		body: "Shipped the new colour system today. Eleven steps per hue, and every component reads a role instead of a raw step.",
		stats: ["24", "8", "132"],
		media: true,
	},
	{
		name: "Mara Lindqvist",
		handle: "@mara · 5h",
		initials: "ML",
		body: "Contrast audit done — dark mode passes AA everywhere except two badges. Fixing those tonight.",
		stats: ["11", "2", "64"],
		media: false,
	},
] as const;

const notifications = [
	["Kai Jensen", "liked your post", "GH", "accent"],
	["Mara Lindqvist", "started following you", "ML", "success"],
	["Tom Aylward", "replied to your thread", "TA", "warning"],
	["Design weekly", "mentioned Axiom", "DW", "error"],
] as const;

export function SocialApp() {
	return (
		<>
			<DeviceFrame label="Feed" caption="Feed">
				<div className="ax-appbar" data-border>
					<span className="ax-appbar-slot">
						<span className="ax-avatar" data-size="sm" data-photo="1">
							RM
						</span>
					</span>
					<span className="ax-appbar-title">Orbit</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-icon-btn">
							<Search className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
					</span>
				</div>

				<div className="ax-segmented" style={{ margin: "12px 16px 0" }}>
					<span data-active>Following</span>
					<span>For you</span>
				</div>

				{posts.map((post) => (
					<div className="ax-body" key={post.handle}>
						<div className="ax-card">
							<div className="ax-card-content">
								<div className="ax-row" style={{ gap: 10 }}>
									<span className="ax-avatar" data-photo="2">
										{post.initials}
									</span>
									<span className="ax-stack" data-gap="2" style={{ flex: 1 }}>
										<span className="ax-item-title ax-semibold">{post.name}</span>
										<span className="ax-item-desc">{post.handle}</span>
									</span>
									<span className="ax-badge" data-variant="info">
										Follow
									</span>
								</div>
								<p className="ax-subhead" style={{ marginTop: 10 }}>
									{post.body}
								</p>
								{post.media && (
									<div className="ax-media" style={{ height: 120, marginTop: 10 }} />
								)}
								<div className="ax-row" data-justify="between" style={{ marginTop: 12 }}>
									<span className="ax-footnote ax-muted">
										<MessageCircle className="ax-glyph" size={15} strokeWidth={1.9} />{" "}
										{post.stats[0]}
									</span>
									<span className="ax-footnote ax-muted">
										<Repeat2 className="ax-glyph" size={15} strokeWidth={1.9} />{" "}
										{post.stats[1]}
									</span>
									<span className="ax-footnote ax-muted">
										<Heart className="ax-glyph" size={15} strokeWidth={1.9} />{" "}
										{post.stats[2]}
									</span>
									<span className="ax-footnote ax-muted">
										<Share className="ax-glyph" size={15} strokeWidth={1.9} />
									</span>
								</div>
							</div>
						</div>
					</div>
				))}

				<div className="ax-fill" />
				<div className="ax-tabbar">
					<span className="ax-tabbar-item" data-active>
						<Home className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Feed</span>
					</span>
					<span className="ax-tabbar-item">
						<Users className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Circles</span>
					</span>
					<span className="ax-tabbar-item">
						<Bell className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Activity</span>
					</span>
					<span className="ax-tabbar-item">
						<MessageCircle className="ax-glyph" size={24} strokeWidth={1.9} />
						<span>Inbox</span>
					</span>
				</div>
			</DeviceFrame>

			<DeviceFrame label="Profile" caption="Profile">
				<div className="ax-appbar" data-border>
					<span className="ax-appbar-slot" />
					<span className="ax-appbar-title">@rayane</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-icon-btn">
							<Share className="ax-glyph" size={22} strokeWidth={1.9} />
						</span>
					</span>
				</div>

				<div className="ax-media" style={{ height: 96 }} />

				<div className="ax-body">
					<div className="ax-row" data-justify="between">
						<span className="ax-avatar" data-size="lg" data-photo="1">
							RM
						</span>
						<span className="ax-btn" data-variant="outline">
							<UserPlus className="ax-glyph" size={15} strokeWidth={2} />
							Follow
						</span>
					</div>
					<div className="ax-title3" style={{ marginTop: 8 }}>
						Rayane M.
					</div>
					<div className="ax-footnote ax-muted">
						Design systems · Antananarivo
					</div>
					<p className="ax-subhead" style={{ marginTop: 6 }}>
						Building Axiom — a token-first component set for React Native.
					</p>

					<div className="ax-row" style={{ gap: 18, marginTop: 10 }}>
						<span className="ax-footnote">
							<strong>248</strong> <span className="ax-muted">posts</span>
						</span>
						<span className="ax-footnote">
							<strong>1.2k</strong> <span className="ax-muted">followers</span>
						</span>
						<span className="ax-footnote">
							<strong>184</strong> <span className="ax-muted">following</span>
						</span>
					</div>
				</div>

				<div className="ax-body">
					<div className="ax-card">
						<div className="ax-card-content">
							<div className="ax-row" style={{ gap: 10 }}>
								<span className="ax-avatar" data-size="sm" data-photo="1">
									RM
								</span>
								<span className="ax-placeholder" style={{ flex: 1 }}>
									Share something…
								</span>
								<ImageIcon className="ax-glyph ax-link" size={18} strokeWidth={1.9} />
								<Send className="ax-glyph ax-link" size={18} strokeWidth={1.9} />
							</div>
						</div>
					</div>
				</div>

				<div className="ax-fill" />
			</DeviceFrame>

			<DeviceFrame label="Activity" caption="Activity" grouped>
				<div className="ax-appbar">
					<span className="ax-appbar-slot" />
					<span className="ax-appbar-title">Activity</span>
					<span className="ax-appbar-slot" data-side="end">
						<span className="ax-link ax-text">Mark read</span>
					</span>
				</div>

				<div className="ax-section">This week</div>
				<div className="ax-list" data-inset>
					{notifications.map(([name, action, initials, color]) => (
						<div className="ax-item" key={`${name}-${action}`}>
							<span className="ax-avatar" data-photo="2">
								{initials}
							</span>
							<span className="ax-item-content">
								<span className="ax-item-title">
									<span className="ax-semibold">{name}</span> {action}
								</span>
								<span className="ax-item-desc">2 hours ago</span>
							</span>
							<span className="ax-item-trailing">
								<span className="ax-badge-dot" data-color={color} />
							</span>
						</div>
					))}
				</div>

				<div className="ax-body">
					<div className="ax-alert" data-variant="info">
						<Bell className="ax-glyph" size={20} strokeWidth={1.9} />
						<span className="ax-stack" data-gap="4">
							<span className="ax-alert-title">Quiet hours are on</span>
							<span className="ax-alert-desc">
								Nothing will buzz until 8:00 tomorrow.
							</span>
						</span>
					</div>
				</div>

				<div className="ax-fill" />
			</DeviceFrame>
		</>
	);
}
