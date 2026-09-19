import { Text, View } from "react-native";
import { StyleSheet } from "react-native-unistyles";

export default function Index() {
	return (
		<View style={styles.container}>
			<Text style={styles.label}>Axiom demo · unistyles</Text>
		</View>
	);
}

const styles = StyleSheet.create((theme) => ({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: theme.colors.background,
	},
	label: {
		color: theme.colors.content,
	},
}));
