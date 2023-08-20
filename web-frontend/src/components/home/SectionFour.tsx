import { useMantineTheme, Container, Text, Title, Grid, Card, Image, Badge, Button, Group } from '@mantine/core';
import lime_welcome from './images/lime-welcome.png'  
import lime_canoeing from "./images/lime-canoeing.png";  
import lime_message_sent from "./images/lime-message-sent.png";  
import {
  IconTrash,
  IconBookmark,
  IconGlobe,
  IconChevronDown,
  IconWallet,
  IconCurrencyEthereum,
  IconInfoCircle,
  IconUser,
} from "@tabler/icons-react";

const SectionFour = () => {
    const theme = useMantineTheme();

    return (
      <section id="section-four">
        <Container>
          <Text color="black" align="center">
            <Title
              order={1}
              mb="30px"
              mt={"30px"}
              color="grey"
              style={{ fontSize: 20 }}
            >
              Why Choose Crypto Freelancing?
            </Title>
          </Text>

          <Grid>
            <Grid.Col xs={12} sm={4} md={4} lg={4}>
              <Card
                shadow="sm"
                p="lg"
                style={{
                  height: "100%",
                  borderRadius: 15,
                  backgroundColor: "rgba(#fafffc, 0.6)",
                }}
              >
                <Card.Section>
                  <IconGlobe size="1rem" stroke={3.5} color={"skyblue"} />
                </Card.Section>

                <Group
                  position="apart"
                  style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
                >
                  <Text weight={500}>Global Opportunities</Text>
                </Group>

                <Text size="sm">
                  Crypto knows no borders. Work with clients and projects from
                  around the world, expanding your horizons and network.
                </Text>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={4} md={4} lg={4}>
              <Card
                shadow="sm"
                p="lg"
                style={{
                  height: "auto",
                  borderRadius: 15,
                  backgroundColor: "rgba(#ffffff, 0.6);",
                }}
              >
                <Card.Section>
                  <IconCurrencyEthereum
                    size="1rem"
                    stroke={3.5}
                    color={"skyblue"}
                  />
                </Card.Section>

                <Group
                  position="apart"
                  style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
                >
                  <Text weight={500}> Decentralized Payments</Text>
                </Group>

                <Text size="sm">
                  Say goodbye to traditional payment gateways. With crypto,
                  transactions are direct and secure, minimizing fees and
                  delays.
                </Text>
              </Card>
            </Grid.Col>

            <Grid.Col xs={12} sm={4} md={4} lg={4}>
              <Card
                shadow="sm"
                p="lg"
                style={{
                  height: "100%",
                  borderRadius: 15,
                  backgroundColor: "background-color: rgb(248, 246, 246);",
                }}
              >
                <Card.Section>
                  <IconUser size="1rem" stroke={3.5} color={"skyblue"} />
                </Card.Section>

                <Group
                  position="apart"
                  style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
                >
                  <Text weight={500}>Portfolio Diversity</Text>
                </Group>

                <Text size="sm">
                  Engage with innovative projects across various domains,
                  enriching your portfolio and skillset.
                </Text>
              </Card>
            </Grid.Col>
          </Grid>
        </Container>
      </section>
    );
};

export default SectionFour;