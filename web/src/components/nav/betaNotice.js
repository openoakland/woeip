import { Route } from "react-router-dom";
import { DismissableMessage } from "../ui";

const MESSAGESTYLE = {
	background: "#fec61e",
	marginTop: "1em",
	display: "inline-block",
	width: "100%",
};

const MESSAGECONTENT =
	"WOAQ is currently in early release. You may encounter bugs and data may not be displayed accurately.";

export const BetaNotice = () => {
	return (
		<Route path={["/maps", "/upload"]}>
			<DismissableMessage style={MESSAGESTYLE} content={MESSAGECONTENT} />
		</Route>
	);
};
