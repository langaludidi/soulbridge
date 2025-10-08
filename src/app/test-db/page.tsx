"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

export default function TestDbPage() {
  const [results, setResults] = useState<any[]>([]);

  const addResult = (test: string, success: boolean, data: any) => {
    setResults((prev) => [...prev, { test, success, data, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setResults([]);

    // Test 1: Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    addResult("Authentication", !!user && !authError, { user: user?.id, error: authError });

    if (!user) {
      addResult("Tests aborted", false, "User not authenticated");
      return;
    }

    // Test 2: Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    addResult("Profile exists", !!profile && !profileError, { profile, error: profileError });

    // Test 3: Check if we can read from memorials table
    const { data: memorials, error: readError } = await supabase
      .from("memorials")
      .select("*")
      .limit(1);
    addResult("Read memorials", !readError, { count: memorials?.length, error: readError });

    // Test 4: Try to insert a test memorial
    const testSlug = `test-memorial-${Date.now()}`;
    const { data: insertData, error: insertError } = await supabase
      .from("memorials")
      .insert({
        user_id: user.id,
        full_name: "Test Memorial",
        slug: testSlug,
        status: "draft",
        privacy: "public",
      })
      .select()
      .single();

    addResult("Insert memorial", !!insertData && !insertError, {
      data: insertData,
      error: insertError,
      errorKeys: insertError ? Object.keys(insertError) : [],
      errorJSON: insertError ? JSON.stringify(insertError) : null
    });

    // Test 5: If insert succeeded, try to delete it
    if (insertData) {
      const { error: deleteError } = await supabase
        .from("memorials")
        .delete()
        .eq("id", insertData.id);
      addResult("Delete test memorial", !deleteError, { error: deleteError });
    }

    // Test 6: Check RLS policies
    const { data: policies, error: policyError } = await supabase
      .rpc("get_policies", { table_name: "memorials" })
      .select();
    addResult("RLS policies", !policyError, { policies, error: policyError });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Database Connection Test</h1>

      <Button onClick={runTests} className="mb-6">
        Run Tests
      </Button>

      <div className="space-y-4">
        {results.map((result, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border ${
              result.success
                ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{result.success ? "✅" : "❌"}</span>
              <h3 className="font-semibold">{result.test}</h3>
            </div>
            <pre className="text-xs overflow-auto bg-white p-2 rounded">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
