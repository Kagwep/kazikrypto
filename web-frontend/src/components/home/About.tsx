import {
  Text,
  Container,
  Anchor,
  MediaQuery,
  Button,
  Image,
  Box,
  Grid,
  Title,
} from "@mantine/core";
import { MdOutlineArrowDownward } from "react-icons/md";
import { Link } from 'react-scroll';

const About = () => {
    //const theme = useMantineTheme();

    return (
      <section id="about">
        <Container fluid sx={{ marginTop: 0 }}>
          <Grid justify="space-around">
            <Grid.Col xs={12.5} sm={12.5} md={12.5} lg={14.5}>
              <div
                style={{ marginBottom: 20, borderRadius: 10 }}
                className="callto"
              >
                <div className="about-content">
                  <Text color="black">
                    <Title
                      order={1}
                      color="blue"
                      style={{ fontSize: 20, marginTop: 20, marginBottom: 20 }}
                    >
                      From Freelancer to Cryptopreneur <br /> Your Journey
                      Starts Here.
                    </Title>
                    Welcome to the world of crypto freelancing!
                    <br /> Whether you're a developer, designer, writer, <br />{" "}
                    or marketer, the crypto space
                    <br />
                    offers exciting opportunities to leverage your
                    <br /> skills and
                    <Anchor href="/"> earn</Anchor>. in cryptocurrencies.{" "}
                  </Text>
                </div>
                <div className="calltoimage">
                  <Image
                    maw={440}
                    mx="auto"
                    radius="md"
                    src="https://res.cloudinary.com/dufdzujik/image/upload/v1692306579/FUN_FOOD/12832654_5097611-removebg-preview_vpi0hp.png"
                    alt="Random image"
                  />
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </Container>
      </section>
    );
};

export default About;