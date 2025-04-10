export type FirewallLog = {
  id: number;
  device_id: number;
  action: string;
  captured_at: string;
  source_ip: IPAddress;
  source_port: number;
  destination_port: number;
};

type IPAddress = {
  id: number;
  address: string;
  geo_location: GeoLocation;
};

type GeoLocation = {
  country_name: string;
  country_code: string;
};

export type Device = {
  id: number;
  name: string;
  key: string;
  os: string;
  status: string;
};

export type SSHLog = {
  id: number;
  device_id: number;
  source_ip: IPAddress;
  process_name: string;
  captured_at: string;
};

export type CountryConnections = {
  inbound: CountryConnection[];
  outbound: CountryConnection[];
};

export type CountryConnection = {
  country_name: string;
  country_code: string;
  total_connections: number;
};
