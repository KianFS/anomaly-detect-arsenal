
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowLeft, Clock, File, FileText, ShieldAlert, Info } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const ThreatDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { detections, setSelectedDetection } = useApp();
  
  const detection = detections.find(d => d.id === id);
  
  useEffect(() => {
    if (detection) {
      setSelectedDetection(detection);
    } else {
      // If detection not found, navigate back to the log
      navigate('/details');
    }
    
    return () => {
      setSelectedDetection(null);
    };
  }, [detection, id, navigate, setSelectedDetection]);
  
  if (!detection) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-medium">Detection not found</h3>
          <p className="text-muted-foreground mt-2">The requested detection does not exist or has been removed</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/details')}
          >
            Back to Detection Log
          </Button>
        </div>
      </div>
    );
  }
  
  const getSeverityIcon = () => {
    switch(detection.severity) {
      case 'critical':
        return <ShieldAlert className="h-6 w-6 text-security-critical" />;
      case 'high':
        return <AlertTriangle className="h-6 w-6 text-security-high" />;
      case 'medium':
        return <AlertTriangle className="h-6 w-6 text-security-medium" />;
      case 'low':
        return <Info className="h-6 w-6 text-security-low" />;
      default:
        return <Info className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate('/details')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Threat Details</h1>
      </div>
      
      <Card>
        <div className={`h-2 w-full bg-security-${detection.severity}`}></div>
        <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              {getSeverityIcon()}
              <CardTitle className="text-2xl">{detection.threat}</CardTitle>
            </div>
            <CardDescription className="mt-2 text-base">{detection.description}</CardDescription>
          </div>
          <Badge className={`severity-${detection.severity} severity-badge text-sm px-3 py-1 mt-4 md:mt-0`}>
            {detection.severity} Severity
          </Badge>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Detection Time</h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p>{new Date(detection.timestamp).toLocaleString()}</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Detection Type</h3>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <p>{detection.isKnownPattern ? 'Known Attack Pattern' : 'Anomalous Behavior'}</p>
              </div>
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-sm font-medium text-muted-foreground">File Path</h3>
              <div className="flex items-center gap-2 mt-1">
                <File className="h-4 w-4 text-muted-foreground" />
                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                  {detection.path}
                </code>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Affected Files</h3>
            <div className="space-y-2">
              {detection.affectedFiles.map((file, index) => (
                <div 
                  key={index}
                  className="bg-muted p-2 rounded flex items-center gap-2"
                >
                  <File className="h-4 w-4 text-muted-foreground" />
                  <code className="text-sm font-mono">{file}</code>
                </div>
              ))}
            </div>
          </div>
          
          {detection.details && (
            <>
              <Separator />
              
              <div className="space-y-4">
                <h3 className="font-medium">Technical Details</h3>
                
                {detection.details.attackVector && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Attack Vector</h4>
                    <p className="mt-1">{detection.details.attackVector}</p>
                  </div>
                )}
                
                {detection.details.technique && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Technique</h4>
                    <p className="mt-1">{detection.details.technique}</p>
                  </div>
                )}
                
                {detection.details.potentialImpact && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Potential Impact</h4>
                    <p className="mt-1">{detection.details.potentialImpact}</p>
                  </div>
                )}
                
                {detection.details.indicators && detection.details.indicators.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Indicators</h4>
                    <ul className="list-disc list-inside mt-1">
                      {detection.details.indicators.map((indicator, index) => (
                        <li key={index} className="text-sm">{indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Recommended Action</h3>
            <div className="bg-accent bg-opacity-50 p-4 rounded">
              <p>{detection.recommendation}</p>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button variant="outline" onClick={() => navigate('/details')}>
            Back to Detection Log
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary">Export Report</Button>
            <Button>Mitigate Threat</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ThreatDetails;
