
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApp } from "../contexts/AppContext";

const SettingsPanel = () => {
  const { isMonitoring, toggleMonitoring } = useApp();
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="general">
        <TabsList className="mb-6 w-full grid grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scanning">Scanning</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Monitoring Settings</CardTitle>
                <CardDescription>Configure how the file system is monitored</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="monitoring">Enable File System Monitoring</Label>
                    <p className="text-sm text-muted-foreground">
                      {isMonitoring 
                        ? "File system monitoring is active" 
                        : "File system monitoring is currently disabled"}
                    </p>
                  </div>
                  <Switch 
                    id="monitoring" 
                    checked={isMonitoring} 
                    onCheckedChange={toggleMonitoring} 
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="startup">Start monitoring on system boot</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically start monitoring when the system starts up
                    </p>
                  </div>
                  <Switch id="startup" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label htmlFor="path">Monitoring Paths</Label>
                  <Input id="path" defaultValue="/usr,/var,/home" />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of directories to monitor
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="exclude">Exclude Paths</Label>
                  <Input id="exclude" defaultValue="/tmp,/proc,/dev" />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of directories to exclude from monitoring
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure application behavior</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="darkMode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use dark color theme
                    </p>
                  </div>
                  <Switch id="darkMode" defaultChecked />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoUpdate">Automatic Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Keep signature database and application up to date
                    </p>
                  </div>
                  <Switch id="autoUpdate" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="scanning">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan Settings</CardTitle>
                <CardDescription>Configure scan frequency and depth</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Scan Frequency</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Less Frequent</span>
                    <Slider 
                      defaultValue={[3]} 
                      max={5} 
                      step={1} 
                      className="w-[60%] mx-4" 
                    />
                    <span className="text-sm text-muted-foreground">More Frequent</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <Label>Scan Depth</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Basic</span>
                    <Slider 
                      defaultValue={[4]} 
                      max={5} 
                      step={1} 
                      className="w-[60%] mx-4" 
                    />
                    <span className="text-sm text-muted-foreground">Deep</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="detectAnomalies">Anomaly Detection</Label>
                    <p className="text-sm text-muted-foreground">
                      Use machine learning to detect unusual file patterns
                    </p>
                  </div>
                  <Switch id="detectAnomalies" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="heuristic">Heuristic Analysis</Label>
                    <p className="text-sm text-muted-foreground">
                      Use behavior-based detection for unknown threats
                    </p>
                  </div>
                  <Switch id="heuristic" defaultChecked />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pattern Settings</CardTitle>
                <CardDescription>Configure known pattern detection</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="patterns">Pattern Database</Label>
                  <div className="flex items-center gap-2">
                    <Input id="patterns" defaultValue="default.patterns" readOnly className="flex-1" />
                    <Button variant="outline">Browse</Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Location of the pattern database file
                  </p>
                </div>
                
                <Separator />
                
                <div className="flex justify-between">
                  <div>
                    <h4 className="font-medium">Pattern Database Status</h4>
                    <p className="text-sm text-muted-foreground">Last updated: Today, 10:34 AM</p>
                  </div>
                  <Button variant="outline" size="sm">Update Now</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how you want to be notified of threats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Notification Levels</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyCritical" className="text-security-critical">Critical Severity</Label>
                    <p className="text-sm text-muted-foreground">
                      Immediate action required
                    </p>
                  </div>
                  <Switch id="notifyCritical" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyHigh" className="text-security-high">High Severity</Label>
                    <p className="text-sm text-muted-foreground">
                      Action required soon
                    </p>
                  </div>
                  <Switch id="notifyHigh" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyMedium" className="text-security-medium">Medium Severity</Label>
                    <p className="text-sm text-muted-foreground">
                      Action recommended
                    </p>
                  </div>
                  <Switch id="notifyMedium" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifyLow" className="text-security-low">Low Severity</Label>
                    <p className="text-sm text-muted-foreground">
                      Informational only
                    </p>
                  </div>
                  <Switch id="notifyLow" />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Notification Methods</h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="systemNotifications">System Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Show alerts as system notifications
                    </p>
                  </div>
                  <Switch id="systemNotifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send alerts via email
                    </p>
                  </div>
                  <Switch id="emailNotifications" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input id="emailAddress" type="email" placeholder="admin@example.com" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end mt-6">
        <Button variant="outline" className="mr-2">Reset to Default</Button>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
