import { GraphQLClient } from "graphql-request";

const endpoint = `https://goapyeufqpuwfwymjpsf.supabase.co/graphql/v1`;

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    apikey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdvYXB5ZXVmcXB1d2Z3eW1qcHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE2ODc0NTAsImV4cCI6MjA0NzI2MzQ1MH0.ZVnrrebtJwhE4AA8ABimOtSM-eHVcSCIFAclqCI_UoM",
  },
});
