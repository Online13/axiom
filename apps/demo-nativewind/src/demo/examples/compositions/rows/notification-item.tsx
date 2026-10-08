import { NotificationItem } from "@/components/compositions/notification-item";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { avatars } from "../fixtures";
import { List, notify } from "../shared";

export default function NotificationItemScreen() {
	return (
		<Screen>
			<Section
				title="NotificationItem"
				description="From a person or from the app, read or unread."
			>
				<List>
					<NotificationItem
						actor="Leo Martin"
						avatar={avatars.leo}
						message="started following you."
						time="2m"
						unread
						actionLabel="Follow back"
						onAction={notify("Following Leo")}
						onPress={notify("Open Leo's profile")}
					/>
					<NotificationItem
						actor="Ana Ribeiro"
						avatar={avatars.ana}
						message="liked your photo."
						time="1h"
						onPress={notify("Open the photo")}
					/>
					<NotificationItem
						icon="notifications"
						message="Your order #10482 has shipped."
						time="3h"
						onPress={notify("Open the order")}
					/>
				</List>
			</Section>
		</Screen>
	);
}
