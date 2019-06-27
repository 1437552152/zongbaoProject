const { environment } = process.env;
const Host =
  environment === 'production' ? 'http://10.110.200.145:8081' : 'http://10.110.200.145:8080';

export default Host;
