
import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Clock, File, Info, Search, ShieldAlert, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Detection, SeverityLevel } from '../types';

const DetectionLog = () => {
  const { detections, dismissDetection } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const getSeverityIcon = (severity: SeverityLevel) => {
    switch(severity) {
      case 'critical':
        return <ShieldAlert className="h-5 w-5 text-security-critical" />;
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-security-high" />;
      case 'medium':
        return <AlertTriangle className="h-5 w-5 text-security-medium" />;
      case 'low':
        return <Info className="h-5 w-5 text-security-low" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };
  
  const filteredDetections = detections.filter(detection => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      detection.threat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detection.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
      detection.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    // Filter by tab selection
    const matchesTab = activeTab === 'all' || detection.severity === activeTab;
    
    return matchesSearch && matchesTab;
  });
  
  // Count detections by severity for the tabs
  const counts = {
    all: detections.length,
    critical: detections.filter(d => d.severity === 'critical').length,
    high: detections.filter(d => d.severity === 'high').length,
    medium: detections.filter(d => d.severity === 'medium').length,
    low: detections.filter(d => d.severity === 'low').length,
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="text-3xl font-bold">Detection Log</CardTitle>
            <CardDescription>View and manage detected threats</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search detections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 w-full grid grid-cols-5">
            <TabsTrigger value="all">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="critical" className="text-security-critical">
              Critical ({counts.critical})
            </TabsTrigger>
            <TabsTrigger value="high" className="text-security-high">
              High ({counts.high})
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-security-medium">
              Medium ({counts.medium})
            </TabsTrigger>
            <TabsTrigger value="low" className="text-security-low">
              Low ({counts.low})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {filteredDetections.length > 0 ? (
              <div className="space-y-4">
                {filteredDetections.map((detection) => (
                  <Card key={detection.id} className="overflow-hidden transition-all hover:shadow-md">
                    <div className={`h-1 w-full bg-security-${detection.severity}`}></div>
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          {getSeverityIcon(detection.severity)}
                          <CardTitle>{detection.threat}</CardTitle>
                          <Badge className={`severity-${detection.severity} severity-badge`}>
                            {detection.severity}
                          </Badge>
                        </div>
                        <CardDescription className="mt-2">{detection.description}</CardDescription>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => dismissDetection(detection.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <File className="h-4 w-4" />
                          <span>Path: {detection.path}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Detected: {new Date(detection.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2">Affected Files:</h4>
                        <div className="flex flex-wrap gap-2">
                          {detection.affectedFiles.map((file, index) => (
                            <Badge key={index} variant="outline">{file}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-1">Recommended Action:</h4>
                        <p className="text-sm text-muted-foreground">{detection.recommendation}</p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Badge variant="outline">
                        {detection.isKnownPattern ? 'Known Pattern' : 'Anomaly'}
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/details/${detection.id}`}>
                          View Details
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No matching detections</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchTerm ? 'Try adjusting your search term' : 'There are no detections in this category'}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DetectionLog;
