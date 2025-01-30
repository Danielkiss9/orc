'use client';

import {
  Button,
  Icons,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@orc/web/ui/custom-ui';

interface InformationDialogProps {
  title: string;
  description: string;
}

export default function InformationDialog(props: InformationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button name="info" size={'icon'} variant={'outline'}>
          <Icons.info className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-center">{props.title}</DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-lg text-center px-4">
          {props.description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
}
