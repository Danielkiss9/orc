// import { PricingClient, GetProductsCommand } from '@aws-sdk/client-pricing';

// const client = new PricingClient({ region: 'us-east-1' });

// async function getAwsResourcePrice(serviceCode: string, filters: any[]): Promise<any> {
//   const command = new GetProductsCommand({
//     ServiceCode: serviceCode,
//     Filters: filters,
//     FormatVersion: 'aws_v1',
//   });

//   try {
//     const response = await client.send(command);
//     return response.PriceList;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Failed to get AWS resource price');
//   }
// }

// export async function getAwsNodePrice(
//   instanceType: string,
//   regionCode: string,
//   marketOption: string,
//   operatingSystem: string,
// ): Promise<any> {
//   const res  = await getAwsResourcePrice('AmazonEC2', [
//     { "Type": "TERM_MATCH", Field: 'instanceType', Value: instanceType },
//     { "Type": "TERM_MATCH", Field: 'regionCode', Value: regionCode },
//     { "Type": "TERM_MATCH", Field: 'operatingSystem', Value: operatingSystem },
//     { "Type": "TERM_MATCH", Field: 'marketoption', Value: marketOption },
//   ]);
//   return res;
// }

export async function getAwsNodePrice(){
  return 0.0348 * 24 * 30; // $0.348 per hour
}

export async function getAwsVolumePrice(storageSizeGB: number): Promise<any> {
  return storageSizeGB * 0.088; // $0.088 per GB per month
}

export async function getAwsLoadBalancerPrice(): Promise<any> {
  return 0.028 * 24 * 30; // $0.028 per hour
}