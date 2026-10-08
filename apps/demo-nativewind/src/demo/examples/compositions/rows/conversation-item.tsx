import { ConversationItem } from "@/components/compositions/conversation-item";
import { Section } from "@/demo/section";
import { Screen } from "@/demo/screen";
import { avatars } from "../fixtures";
import { List, notify } from "../shared";

export default function ConversationItemScreen() {
	return (
		<Screen>
			<Section
				title="ConversationItem"
				description="Preview, time, unread count and muted."
			>
				<List>
					<ConversationItem
						name="Maya Chen"
						avatar={avatars.maya}
						status="online"
						preview="See you at 8 then!"
						time="2m"
						unreadCount={3}
						onPress={notify("Open chat")}
					/>
					<ConversationItem
						name="Design team"
						preview="Leo: pushed the new icons"
						time="1h"
						unreadCount={12}
						muted
						onPress={notify("Open chat")}
					/>
					<ConversationItem
						name="Sam Park"
						avatar={avatars.sam}
						preview="Thanks!"
						time="Mon"
						onPress={notify("Open chat")}
						onLongPress={notify("Chat options")}
					/>
				</List>
			</Section>
		</Screen>
	);
}
