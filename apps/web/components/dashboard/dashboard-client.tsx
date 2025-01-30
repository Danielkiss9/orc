import { DashboardHeader } from '@orc/web/components/dashboard/header';
import { DashboardShell } from '@orc/web/components/dashboard/shell';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@orc/web/ui/custom-ui';

import { Bell, LineChart, Package, ShoppingCart } from 'lucide-react';
import BasicLineChart from '../charts/basic-line-chart';
import { User } from 'next-auth';

export async function DashboardContent() {
  // Todo: auth required
  // const user = await getCurrentUser();

  // const globalAnalysis = await getGlobalAnalysis();

  return (
    <>
      <DashboardShell>
        {/* Recent alerts and tracked items */}
        <DashboardHeader
          heading="Dashboard"
          text={`Welcome back, User!`}
        />
        {/* Summary cards */}
        <div className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Items Tracked
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                100
              </div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Alerts
              </CardTitle>
              <Bell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">3 triggered today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Price Change
              </CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                20%
              </div>
              <p className="text-xs text-muted-foreground">Across all items</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Potential Savings
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $0
              </div>
              <p className="text-xs text-muted-foreground">
                Based on current alerts
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Price trends chart (placeholder) */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Price Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <BasicLineChart data={{}} itemName="Trends" />
          </CardContent>
        </Card>

        {/* Recent alerts and tracked items */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Smartphone X</p>
                    <p className="text-sm text-muted-foreground">
                      Price dropped by 15%
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </li>
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Laptop Y</p>
                    <p className="text-sm text-muted-foreground">
                      Back in stock
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </li>
                <li className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Headphones Z</p>
                    <p className="text-sm text-muted-foreground">
                      Price increased by 5%
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tracked Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Current Price</TableHead>
                    <TableHead>Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Smartphone X</TableCell>
                    <TableCell>$599.99</TableCell>
                    <TableCell className="text-green-600">-$100.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Laptop Y</TableCell>
                    <TableCell>$1,299.00</TableCell>
                    <TableCell className="text-red-600">+$50.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Headphones Z</TableCell>
                    <TableCell>$149.99</TableCell>
                    <TableCell className="text-green-600">-$30.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </DashboardShell>
    </>
  );
}
