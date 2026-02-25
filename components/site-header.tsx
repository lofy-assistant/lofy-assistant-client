import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MessageCircle } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        {/* <h1 className="text-base font-medium">Documents</h1> */}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" asChild size="sm" className="flex text-primary hover:text-primary hover:bg-primary/10 dark:hover:bg-primary/20 border-primary">
            <a href="https://wa.me/60105043846" rel="noopener noreferrer" target="_blank" className="flex items-center justify-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Chat with Lofy</span>
            </a>
          </Button>
          <Button variant="ghost" asChild size="sm" className="flex">
            <a href="/guides" rel="noopener noreferrer" target="_blank" className="dark:text-foreground">
              Guide
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
