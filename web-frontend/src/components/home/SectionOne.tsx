import { Carousel } from '@mantine/carousel';
import { Text, Container, useMantineTheme, Title } from '@mantine/core';
import './styles/SectionOne.scss';

const SectionOne = () => {
    const theme = useMantineTheme();

    const carouselContent = {
      height: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column" as "column",
      backgroundColor: "inherit",
      borderRadius: 15,
      gap: 15,
    };

    return (
      <section id="section-one">
        <Container style={{ backgroundColor: "#feffff",borderRadius:10 }}>
          <Text color="black" align="center" mb="15px" mt={"30px"}>
            <Title order={1} color="grey" style={{ fontSize: 20 }}>
              Getting Started as a Crypto Freelancer
            </Title>
          </Text>

          {/* <Text color="black" align="center" mb="25px">
            You can insert images or some texts if you need.
          </Text> */}

          <Carousel
            withIndicators
            height={300}
            slideSize="33.333333%"
            slideGap="md"
            breakpoints={[
              { maxWidth: "md", slideSize: "50%" },
              { maxWidth: "sm", slideSize: "100%", slideGap: 15 },
            ]}
            loop
            align="start"
            pr="10px"
            pl="10px"
          >
            <Carousel.Slide>
              <div style={carouselContent}>
                <Title style={{ fontSize: 20 }} color="grey" order={2}>
                  1
                </Title>
                <Text color="blue">Skill Assessment.</Text>
                <Text style={{ padding: 5, textAlign: "center" }}>
                  Identify your strengths and skills that align with the crypto
                  industry. Highlight your unique value proposition.
                </Text>
              </div>
            </Carousel.Slide>
            <Carousel.Slide>
              <div style={carouselContent}>
                <Title style={{ fontSize: 20 }} color="grey" order={2}>
                  2
                </Title>
                <Text color="blue">Setting Up a Crypto Wallet.</Text>
                <Text style={{ padding: 5, textAlign: "center" }}>
                  Choose a secure cryptocurrency wallet to receive payments and
                  manage your earnings.
                </Text>
              </div>
            </Carousel.Slide>
            <Carousel.Slide>
              <div style={carouselContent}>
                <Title style={{ fontSize: 20 }} color="grey" order={2}>
                  3
                </Title>
                <Text color="blue">Portfolio Development</Text>
                <Text style={{ padding: 5, textAlign: "center" }}>
                  Create a portfolio showcasing your previous work, emphasizing
                  any crypto-related projects or collaborations.
                </Text>
              </div>
            </Carousel.Slide>
            <Carousel.Slide>
              <div style={carouselContent}>
                <Title style={{ fontSize: 20 }} color="grey" order={2}>
                  4
                </Title>
                <Text>
                  Join the cmmunity and explore opportunities on the job
                  section, connect with potential clients and stay updated on
                  industry trends.
                </Text>
              </div>
            </Carousel.Slide>
          </Carousel>
        </Container>
      </section>
    );
};

export default SectionOne;