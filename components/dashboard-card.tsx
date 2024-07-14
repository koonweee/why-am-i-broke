import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Props {
  title?: string;
  children: React.ReactNode;
}

export default function DashboardCard(props: Props) {
  const { title, children } = props;
  return (
    <Card>
      {title && (
        <CardHeader className="py-2">
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className={cn("py-3", title ? "border-t" : "")}>
        {children}
      </CardContent>
    </Card>
  );
}
