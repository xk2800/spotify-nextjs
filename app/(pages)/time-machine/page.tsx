'use client'

import Loading from "@/components/Loading";
import { Card, CardContent } from "@/components/ui/card";
import { Suspense } from "react";
import TimeMachineContent from "@/components/TimeMachineContent";

// Main component with Suspense wrapper
const TimeMachinePage = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Card>
        <CardContent>
          <TimeMachineContent />
        </CardContent>
      </Card>
    </Suspense>
  );
};

export default TimeMachinePage;