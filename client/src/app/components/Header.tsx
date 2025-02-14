import { Button, createStyles, Group, Image, Space, Text } from "@mantine/core";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Download, Send } from "tabler-icons-react";
import { useCommonStyles } from "../hooks/useCommonStyles";
import { useWormhole } from "../hooks/useWormhole";

const useStyles = createStyles((theme) => ({
  container: {
    margin: "0 40px",
    [`@media (max-width: ${theme.breakpoints.sm - 1}px)`]: {
      margin: 0,
    },
  },
  headerTextSuper: {
    fontWeight: "lighter",
    fontSize: 20,
    color: theme.colors["dark-grey"][6],
    position: "relative",
    bottom: 7,
  },
}));

export default function Header() {
  const wormhole = useWormhole();
  const location = useLocation();
  const navigate = useNavigate();
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Space h="lg" />
      <Group position="apart">
        <Group align="start" spacing={8}>
          <Link to="/s">
            <Image
              width={200}
              fit="contain"
              src="/LA_Winden_HorizontalLogo_Color.svg"
            />
          </Link>
          <Text className={classes.headerTextSuper} component="span">
            BETA
          </Text>
        </Group>
        {location.pathname === "/s" ? (
          <Button
            leftIcon={<Download />}
            data-testid="go-to-receive-page"
            color="medium-grey"
            onClick={() => {
              navigate("/r");
              if (wormhole?.fileMeta) {
                // cancellation workaround
                window.location.reload();
              } else {
                wormhole?.reset();
              }
            }}
            styles={{
              label: {
                fontSize: 16,
              },
            }}
          >
            Receive
          </Button>
        ) : (
          <Button
            leftIcon={<Send />}
            data-testid="go-to-send-page"
            color="medium-grey"
            onClick={() => {
              navigate("/s");
              if (wormhole?.fileMeta) {
                // cancellation workaround
                window.location.reload();
              } else {
                wormhole?.reset();
              }
            }}
            styles={{
              label: {
                fontSize: 16,
              },
            }}
          >
            Send
          </Button>
        )}
      </Group>
      <Space h="lg" />
    </div>
  );
}
