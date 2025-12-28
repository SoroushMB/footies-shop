'use client';

import { useUser, useAuth } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Package, MapPin, CreditCard, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usersApi, checkoutApi, type Order, type ShippingAddress } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!isLoaded || !user) return;

      const token = await getToken();
      if (!token) return;

      // Fetch user profile
      try {
        const userResponse = await usersApi.getMe(token);
        if (userResponse.success && userResponse.data?.shippingAddress) {
          setShippingAddress(userResponse.data.shippingAddress);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }

      // Fetch orders
      setIsLoadingOrders(true);
      try {
        const ordersResponse = await checkoutApi.getOrders(token);
        if (ordersResponse.success && ordersResponse.data) {
          setOrders(ordersResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoadingOrders(false);
      }
    }

    fetchData();
  }, [isLoaded, user, getToken]);

  const handleSaveAddress = async () => {
    const token = await getToken();
    if (!token) return;

    setIsSaving(true);
    try {
      const response = await usersApi.updateMe(token, { shippingAddress });
      if (response.success) {
        toast({
          title: 'Address saved',
          description: 'Your shipping address has been updated.',
        });
      }
    } catch (error) {
      console.error('Failed to save address:', error);
      toast({
        title: 'Error',
        description: 'Failed to save address. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Please sign in</h1>
        <p className="text-neutral-400">You need to be signed in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Account</h1>
        <p className="text-neutral-400">Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress}</p>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="bg-white/10 border border-white/20">
          <TabsTrigger value="orders" className="data-[state=active]:bg-green-600">
            <Package className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="address" className="data-[state=active]:bg-green-600">
            <MapPin className="w-4 h-4 mr-2" />
            Address
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-green-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Order History</CardTitle>
              <CardDescription className="text-neutral-400">
                View your past orders and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingOrders ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                  <p className="text-neutral-400">No orders yet</p>
                  <p className="text-neutral-500 text-sm mt-2">
                    When you place an order, it will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-lg bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">
                          Order #{order.id.slice(0, 8)}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            order.status === 'delivered'
                              ? 'bg-green-500/20 text-green-400'
                              : order.status === 'shipped'
                              ? 'bg-blue-500/20 text-blue-400'
                              : order.status === 'cancelled'
                              ? 'bg-red-500/20 text-red-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="text-white font-medium">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Shipping Address</CardTitle>
              <CardDescription className="text-neutral-400">
                Manage your default shipping address
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="street" className="text-white">Street Address</Label>
                  <Input
                    id="street"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="123 Main St"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city" className="text-white">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-white">State</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="zip" className="text-white">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={shippingAddress.zip}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="12345"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-white">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
              <Button
                onClick={handleSaveAddress}
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? 'Saving...' : 'Save Address'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="bg-black/40 backdrop-blur-xl border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Account Settings</CardTitle>
              <CardDescription className="text-neutral-400">
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <CreditCard className="w-8 h-8 text-neutral-400" />
                <div className="flex-1">
                  <h3 className="text-white font-medium">Payment Methods</h3>
                  <p className="text-neutral-400 text-sm">Manage your payment methods</p>
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Manage
                </Button>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-white/10">
                <Settings className="w-8 h-8 text-neutral-400" />
                <div className="flex-1">
                  <h3 className="text-white font-medium">Email Preferences</h3>
                  <p className="text-neutral-400 text-sm">Manage your email notifications</p>
                </div>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
