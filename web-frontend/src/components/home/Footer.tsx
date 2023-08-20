import {
  useMantineTheme,
  Container,
  Grid,
  Text,
  Button,
  Group,
  Avatar,
  UnstyledButton,
  Anchor,
  Code,
  Image,
} from "@mantine/core";

const Footer = () => {
  const theme = useMantineTheme();

  return (
    <footer style={{ backgroundColor: "white" }}>
      <Container>
        <Grid justify="space-around">
          <Grid.Col xs={12} sm={8} md={8} lg={8}>
            <Text size="xl" weight={700} color="blue" mb="10px">
              Kazi Krypto
            </Text>

            <Text color="black" mb="5px">
              Unlock Your Freelance Potential in Crypto. Join us to connect with
              projects, earn in cryptocurrencies, and shape the future of
              decentralized work.
            </Text>

            <Text color="grey" mb="20px">
              Contact us at <Anchor href="/">twigadevs</Anchor>
            </Text>

            {/* <Button
              variant="white"
              color="black"
              onClick={() => redirectToLink("https://mantine.dev/")}
            >
              Check out Mantine
            </Button> */}
          </Grid.Col>

          <Grid.Col xs={12} sm={4} md={4} lg={4}>
            <Code
              color="yellow"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                padding: 15,
              }}
            >
              Twiga Devs
              <Anchor href="https://github.com/TwigaDEVs">
                <UnstyledButton>
                  <Group>
                    <Avatar size={40} color="orange">
                      <Image />
                    </Avatar>
                    <div>
                      <Text>kazikrypto</Text>
                      <Text size="xs" color="dimmed">
                        <Anchor href="https://twigadevs.github.io/"> TDVs</Anchor>
                      </Text>
                    </div>
                  </Group>
                </UnstyledButton>
              </Anchor>
            </Code>
          </Grid.Col>
        </Grid>
      </Container>
    </footer>
  );
};

export default Footer;

const redirectToLink = (link: string): void => {
  window.open(link, "_blank");
};
