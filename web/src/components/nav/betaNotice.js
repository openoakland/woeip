import { Route } from "react-router-dom";
import { DismissableMessage } from "../ui";
import "./betaNotice.css";

const MESSAGECONTENT =
	"WOAQ is currently in early release. You may encounter bugs and data may not be displayed accurately.";

export const BetaNotice = () => (
	<Route path={["/maps", "/upload"]}>
		<DismissableMessage className="beta-notice" content={MESSAGECONTENT} />
	</Route>
);
