import { Title, Text, Container, Grid, Image, Button,Anchor } from '@mantine/core';
import limeSurfingImage from "./images/lime-surfing.png";

const SectionTwo = () => {
    //const theme = useMantineTheme();

    return (
      <section id="section-two">
        <Container>
          <Grid justify="space-around">
            <Grid.Col xs={12.5} sm={12.5} md={12.5} lg={12.5} >
              <div style={{ marginBottom: 20,borderRadius:10 }} className="callto">
                <div className="calltoimage">
                  <Image
                    maw={440}
                    mx="auto"
                    radius="md"
                    src="https://res.cloudinary.com/dufdzujik/image/upload/v1692313106/FUN_FOOD/11906541_4860250-removebg-preview_bgthv3.png"
                    alt="Random image"
                  />
                </div>
                <div className="calltocontent">
                  <Text color="black">
                    <Title
                      order={1}
                      color="blue"
                      style={{ fontSize: 20, marginTop: 20, marginBottom: 20 }}
                    >
                      Ready to Begin Your Crypto Freelance Journey?
                    </Title>
                    Start exploring projects, connecting with clients, <br /> and
                    earning in cryptocurrencies today!{" "}
                    <Anchor
                      color="skyblue"
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        borderRadius: 5,
                        padding: 5,
                      }}
                    > <br />
                      {" "}
                      Join
                    </Anchor>{" "}
                    and embark on an exciting crypto freelancing journey.
                  </Text>
                </div>
              </div>
            </Grid.Col>
          </Grid>
        </Container>
      </section>
    );
};

export default SectionTwo;