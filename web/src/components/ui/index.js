import { Button, Icon, Input, Message, Header } from "semantic-ui-react";
import "./index.css";

export {
  Header,
  Button,
  Input,
  Container,
  Segment,
  Menu,
  Modal,
  Dimmer,
  Loader,
  List,
  Divider,
  Icon,
  Label,
  Grid,
} from "semantic-ui-react";

export const LinkedHeader = ({ ...props }) => (
  <h4 {...props} className="linked-header" />
);

export const PositiveActionButton = ({ ...props }) => (
  <Button positive {...props} />
);

export const NeutralActionButton = ({ ...props }) => <Button {...props} />;

export const RevertActionButton = ({ ...props }) => (
  <Button basic color="black" {...props} />
);

export const TrashButton = ({ ...props }) => (
  <IconButton {...props}>
    <Icon name="trash" />
  </IconButton>
);

export const AffirmActionButton = ({ ...props }) => (
  <Button color="black" {...props} />
);

export const IconButton = ({ ...props }) => (
  <Button icon style={{ background: "none" }} {...props} />
);

export const FileIcon = ({ ...props }) => (
  <Icon size="huge" name="file outline" {...props} />
);

export const CalendarInput = ({ ...props }) => (
  <Input icon="calendar outline" {...props} />
);

export const SuccessMessage = ({ ...props }) => <Message success {...props} />;

export const WarningMessage = ({ ...props }) => <Message warning {...props} />;

export const FlexColumnDiv = ({ ...props }) => (
  <div className="flex-column" {...props} />
);

export const FlexRowCenterDiv = ({ ...props }) => (
  <div className="flex-row justify-center" {...props} />
);
