import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CHART_TEMPLATES = {
  sequence: `sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth
    participant DB as Database
    participant M as Mechanic

    U->>F: Search for mechanics
    F->>A: Verify user session
    A-->>F: Session valid
    F->>DB: Query mechanics by location
    DB-->>F: Return mechanic list
    F->>U: Display search results
    
    U->>F: Select mechanic
    F->>DB: Get mechanic details
    DB-->>F: Return mechanic profile
    F->>U: Show mechanic profile
    
    U->>F: Request service
    F->>A: Verify authentication
    A-->>F: User authenticated
    F->>DB: Create service request
    DB-->>F: Request created
    F->>M: Notify mechanic
    M-->>F: Accept request
    F->>U: Confirmation sent`,

  usecase: `graph TB
    U[User] --> UC1[Search Mechanics]
    U --> UC2[Book Service]
    U --> UC3[Track Service]
    U --> UC4[Rate & Review]
    U --> UC5[Manage Profile]
    U --> UC6[Payment Management]
    
    M[Mechanic] --> UC7[Create Profile]
    M --> UC8[Manage Services]
    M --> UC9[Accept Requests]
    M --> UC10[Update Status]
    M --> UC11[View Earnings]
    
    A[Admin] --> UC12[User Management]
    A --> UC13[Mechanic Verification]
    A --> UC14[System Monitoring]
    A --> UC15[Analytics Dashboard]
    A --> UC16[Content Management]
    
    UC1 --> S1[Filter by Location]
    UC1 --> S2[Filter by Service Type]
    UC1 --> S3[Sort by Rating]
    
    UC2 --> S4[Select Date/Time]
    UC2 --> S5[Add Vehicle Details]
    UC2 --> S6[Confirm Payment]
    
    UC13 --> S7[Verify Documents]
    UC13 --> S8[Background Check]
    UC13 --> S9[Approve/Reject]`,

  erd: `erDiagram
    USERS {
        uuid id PK
        string email UK
        string first_name
        string last_name
        string phone
        timestamp created_at
        timestamp updated_at
    }
    
    PROFILES {
        uuid id PK
        uuid user_id FK
        string display_name
        string avatar_url
        text bio
        timestamp created_at
        timestamp updated_at
    }
    
    MECHANICS {
        uuid id PK
        uuid user_id FK
        string business_name
        text description
        json specializations
        decimal hourly_rate
        string location
        point coordinates
        boolean verified
        decimal rating
        integer total_reviews
        timestamp created_at
        timestamp updated_at
    }
    
    VEHICLES {
        uuid id PK
        uuid user_id FK
        string make
        string model
        integer year
        string license_plate
        text notes
        timestamp created_at
        timestamp updated_at
    }
    
    SERVICE_REQUESTS {
        uuid id PK
        uuid user_id FK
        uuid mechanic_id FK
        uuid vehicle_id FK
        string service_type
        text description
        string status
        decimal estimated_cost
        decimal final_cost
        timestamp scheduled_at
        timestamp completed_at
        timestamp created_at
        timestamp updated_at
    }
    
    REVIEWS {
        uuid id PK
        uuid service_request_id FK
        uuid user_id FK
        uuid mechanic_id FK
        integer rating
        text comment
        boolean is_public
        timestamp created_at
    }
    
    USERS ||--o{ PROFILES : has
    USERS ||--o{ MECHANICS : "can be"
    USERS ||--o{ VEHICLES : owns
    USERS ||--o{ SERVICE_REQUESTS : creates
    MECHANICS ||--o{ SERVICE_REQUESTS : receives
    VEHICLES ||--o{ SERVICE_REQUESTS : involves
    SERVICE_REQUESTS ||--o| REVIEWS : generates
    USERS ||--o{ REVIEWS : writes
    MECHANICS ||--o{ REVIEWS : receives`,

  process: `graph TD
    A[User Opens App] --> B{Authenticated?}
    B -->|No| C[Show Login/Register]
    B -->|Yes| D[Show Dashboard]
    
    C --> E[User Registers/Logs In]
    E --> F[Create/Update Profile]
    F --> D
    
    D --> G[Search Mechanics]
    G --> H[Apply Filters]
    H --> I[Display Results]
    I --> J[Select Mechanic]
    
    J --> K[View Mechanic Profile]
    K --> L{Book Service?}
    L -->|No| I
    L -->|Yes| M[Fill Service Details]
    
    M --> N[Select Vehicle]
    N --> O[Choose Date/Time]
    O --> P[Review & Confirm]
    P --> Q[Process Payment]
    
    Q --> R{Payment Success?}
    R -->|No| S[Show Error]
    S --> Q
    R -->|Yes| T[Create Service Request]
    
    T --> U[Notify Mechanic]
    U --> V{Mechanic Accepts?}
    V -->|No| W[Find Alternative]
    W --> I
    V -->|Yes| X[Confirm Booking]
    
    X --> Y[Service in Progress]
    Y --> Z[Service Completed]
    Z --> AA[Request Review]
    AA --> BB[Update Ratings]
    BB --> CC[Process Payment to Mechanic]
    CC --> DD[End]`
};

export default function ChartEditor() {
  const [activeChart, setActiveChart] = useState<keyof typeof CHART_TEMPLATES>('sequence');
  const [chartCode, setChartCode] = useState(CHART_TEMPLATES.sequence);
  const [isRendering, setIsRendering] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'monospace'
    });
  }, []);

  useEffect(() => {
    setChartCode(CHART_TEMPLATES[activeChart]);
  }, [activeChart]);

  useEffect(() => {
    renderChart();
  }, [chartCode]);

  const renderChart = async () => {
    if (!chartRef.current) return;
    
    setIsRendering(true);
    try {
      chartRef.current.innerHTML = '';
      const { svg } = await mermaid.render(`chart-${Date.now()}`, chartCode);
      chartRef.current.innerHTML = svg;
    } catch (error) {
      console.error('Chart rendering error:', error);
      chartRef.current.innerHTML = '<p class="text-destructive">Invalid chart syntax</p>';
    }
    setIsRendering(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(chartCode);
      toast({
        title: "Copied!",
        description: "Chart code copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const downloadChart = () => {
    const svgElement = chartRef.current?.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeChart}-chart.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            System Flow Charts
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadChart}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download SVG
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={renderChart}
                disabled={isRendering}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRendering ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeChart} onValueChange={(value) => setActiveChart(value as keyof typeof CHART_TEMPLATES)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sequence">Sequence</TabsTrigger>
              <TabsTrigger value="usecase">Use Case</TabsTrigger>
              <TabsTrigger value="erd">ERD</TabsTrigger>
              <TabsTrigger value="process">Process</TabsTrigger>
            </TabsList>
            
            <div className="mt-6 grid lg:grid-cols-2 gap-6">
              {/* Chart Display */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Chart Preview</h3>
                <div 
                  ref={chartRef}
                  className="border border-border rounded-lg p-4 bg-background min-h-[400px] overflow-auto"
                  style={{ fontSize: '14px' }}
                />
              </div>
              
              {/* Code Editor */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Mermaid Code</h3>
                <Textarea
                  value={chartCode}
                  onChange={(e) => setChartCode(e.target.value)}
                  className="font-mono text-sm min-h-[400px] resize-none"
                  placeholder="Enter Mermaid chart code here..."
                />
              </div>
            </div>
            
            {/* Chart Descriptions */}
            <TabsContent value="sequence" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Sequence Diagram</h4>
                  <p className="text-muted-foreground">
                    Shows the interaction flow between User, Frontend, Authentication, Database, and Mechanic components
                    for the core user journey of finding and booking a mechanic service.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usecase" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Use Case Diagram</h4>
                  <p className="text-muted-foreground">
                    Illustrates the different actions that Users, Mechanics, and Admins can perform in the system,
                    including their sub-processes and relationships.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="erd" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Entity Relationship Diagram</h4>
                  <p className="text-muted-foreground">
                    Represents the database structure showing relationships between Users, Profiles, Mechanics, 
                    Vehicles, Service Requests, and Reviews tables.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="process" className="mt-6">
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Process Flow</h4>
                  <p className="text-muted-foreground">
                    Details the complete user journey from app opening through service completion,
                    including decision points and alternative paths.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}