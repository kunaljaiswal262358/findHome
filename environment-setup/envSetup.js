import { loadEnvFile } from "process";

const config = ({environment}) => {
  const evnFilePath = `./.env.${environment}`;
  loadEnvFile(evnFilePath);
};

export default config;
