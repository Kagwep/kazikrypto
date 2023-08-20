import { Accordion, Text, Container, Title, Badge } from '@mantine/core';
import { FiCoffee, FiCloudSnow, FiAnchor } from "react-icons/fi";

const SectionFive = () => {
    //const theme = useMantineTheme();

    return (
      <section id="section-five">
        <Container>
          <div style={{ marginBottom: 30 }}>
            <div style={{ textAlign: "left" }}>
              <Badge variant="filled" color="skyblue">
                FAQs
              </Badge>
            </div>
            <Text color="black">
              <Title order={1} style={{ marginTop: 10 ,fontSize:20}} color='grey'>
                Frequently Asked Questions (FAQs)
              </Title>
            </Text>
          </div>

          <Accordion variant="contained">
            <Accordion.Item value="item1">
              <Accordion.Control
              // icon={<FiCoffee size={20} color={"#fab005"} />}
              >
                What is Kazi Krypto?
              </Accordion.Control>
              <Accordion.Panel>
                Kazi Krypto is a platform that connects skilled freelancers with
                clients seeking services in the crypto and blockchain industry.
                We offer a range of projects across various domains within the
                crypto space.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="item2">
              <Accordion.Control
              // icon={<FiCloudSnow size={20} color={"#fab005"} />}
              >
                How does Kazi Krypto work for freelancers?
              </Accordion.Control>
              <Accordion.Panel>
                As a freelancer, you can create a profile showcasing your
                skills, experience, and past projects. Browse through available
                projects, submit proposals, and collaborate with clients
                directly through our platform. You'll have the opportunity to
                earn in cryptocurrencies and expand your professional network.
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="item3">
              <Accordion.Control
              // icon={<FiAnchor size={20} color={"#fab005"} />}
              >
                How do I get paid for my work?
              </Accordion.Control>
              <Accordion.Panel>
                Payments are handled securely through cryptocurrency
                transactions. You'll need to set up a crypto wallet linked to
                your profile to receive payments. Once a project is completed
                and approved by the client, you'll receive your earnings
                directly in your wallet.
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </Container>
      </section>
    );

};

export default SectionFive;