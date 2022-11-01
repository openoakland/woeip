import { useState } from "react";
import { Button, Icon, Input, Message } from "semantic-ui-react";
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
  Image,
} from "semantic-ui-react";

export const LinkedHeader = ({ ...props }) => (
  // eslint-disable-next-line jsx-a11y/heading-has-content
  <h4 {...props} className="linked-header" />
);

export const PositiveActionButton = ({ ...props }) => (
  <Button positive {...props} />
);

export const NeutralActionButton = ({ ...props }) => <Button {...props} />;

export const RevertActionButton = ({ ...props }) => (
  <Button basic color="black" {...props} />
);

export const AffirmActionButton = ({ ...props }) => (
  <Button color="black" {...props} />
);

export const TrashButton = ({ ...props }) => (
  <IconButton {...props}>
    <Icon name="trash" />
  </IconButton>
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

export const WarningMessage = ({ ...props }) => {
  const absolute = props.absolute;
  delete props.absolute;
  return (
    <Message
      warning
      style={absolute ? { position: "absolute", bottom: "0px" } : {}}
      {...props}
    />
  );
};

export const DismissableMessage = ({ ...props }) => {
  const [visible, setVisible] = useState(true);
  const handleDismiss = () => setVisible(false);

  return visible ? <Message onDismiss={handleDismiss} {...props} /> : null;
};

export const FlexColumnDiv = ({ ...props }) => (
  <div className="flex-column" {...props} />
);

export const FlexRowCenterDiv = ({ ...props }) => (
  <div className="flex-row justify-center" {...props} />
);
