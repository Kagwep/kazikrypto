import { useSwitchNetwork } from "~/hooks/useSwitchNetwork";
import { Button } from "@mantine/core";

// import styles from './SwitchNetwork.module.css'

const SwitchNetwork = () => {
  const { switchNetwork } = useSwitchNetwork();
  return (
    <Button
      onClick={switchNetwork}
      color="dark"
      radius="md"
      sx={{ marginLeft: 10 }}
    >
      Switch Chain
    </Button>
  );
};

export default SwitchNetwork;
