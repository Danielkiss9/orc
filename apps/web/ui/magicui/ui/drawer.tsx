import { cn } from '@orc/web/ui/custom-ui/utils';
import Link from 'next/link';
import { IoMenuSharp } from 'react-icons/io5';
import { buttonVariants, Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTrigger, Icons } from '@orc/web/ui/custom-ui/index';
import { siteConfig } from '@orc/web/config/site';

export default function drawer() {
  return (
    <Drawer>
      <DrawerTrigger>
        <IoMenuSharp className="text-2xl" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="px-6">
          <div className="">
            <Link href="/" title="brand-logo" className="relative mr-6 flex items-center space-x-2">
              <Icons.logo className="w-auto h-[40px]" />
              <span className="font-bold text-xl">{siteConfig.name}</span>
            </Link>
          </div>
        </DrawerHeader>
        <DrawerFooter>
          <Link href="/login" className={buttonVariants({ variant: 'outline' })}>
            Login
          </Link>
          <Link href="/signup" className={cn(buttonVariants({ variant: 'default' }), 'w-full sm:w-auto text-background flex gap-2')}>
            <Icons.logo className="h-6 w-6" />
            Get Started for Free
          </Link>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
