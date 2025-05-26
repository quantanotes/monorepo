// import { useState, useMemo } from 'react';
// import { z } from 'zod';
// import { Mail, Plus, Settings2, Trash2, AlertCircle } from 'lucide-react';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@quanta/ui/dialog';
// import { Button } from '@quanta/ui/button';
// import { Badge } from '@quanta/ui/badge';
// import { Input } from '@quanta/ui/input';
// import { Alert, AlertDescription } from '@quanta/ui/alert';
// import { Card } from '@quanta/ui/card';
// import { Checkbox } from '@quanta/ui/checkbox';
// import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from '@quanta/ui/dropdown-menu';
// import { useAppForm } from '@quanta/ui/form';
// import { useTools } from '@quanta/web/contexts/tool';

// const TOOL_DEFINITIONS = {
//   email: {
//     icon: Mail,
//     description: 'Send emails through SMTP',
//     schema: z.object({
//       email: z.string().email('Please enter a valid email'),
//       host: z.string().min(1, 'SMTP host is required'),
//       port: z.number().min(1, 'Port must be a positive number'),
//       username: z.string().min(1, 'Username is required'),
//       password: z.string().min(1, 'Password is required'),
//       tls: z.boolean(),
//     }),
//     defaultValues: {
//       email: '',
//       host: 'smtp.gmail.com',
//       port: 587,
//       username: '',
//       password: '',
//       tls: true,
//     },
//   },
// };

// export function ToolDialog({ trigger }) {
//   const { useToolsLive, createTool, updateTool, deleteTool } = useTools()!;
//   const tools = useToolsLive();
//   const [editing, setEditing] = useState(null);
//   const [deleteConfirm, setDeleteConfirm] = useState(null);
//   const currentTool = useMemo(() => {
//     if (!editing) return null;
//     return TOOL_DEFINITIONS[editing.type];
//   }, [editing]);

//   const form = useMemo(() => editing && useAppForm({
//     defaultValues: editing.config || currentTool?.defaultValues : {},
//     validators: editing ? { onChange: currentTool?.schema } : {},
//     onSubmit: async ({ value }) => {
//       if (!editing) return;
//       await updateTool(editing.id, value);
//       setEditing(null);
//     },
//   }));

//   const handleSave = (e) => {
//     e.preventDefault();
//     form.handleSubmit();
//   };

//   const ToolIcon = (type) => TOOL_DEFINITIONS[type]?.icon || Settings2;

//   return (
//     <Dialog onOpenChange={() => {
//       setEditing(null);
//       setDeleteConfirm(null);
//     }}>
//       <DialogTrigger asChild>{trigger}</DialogTrigger>
//       <DialogContent className="max-w-3xl">
//         <DialogHeader>
//           <DialogTitle>Manage Tools</DialogTitle>
//           <DialogDescription>
//             Tools give your AI agent access to external services and capabilities.
//           </DialogDescription>
//         </DialogHeader>

//         {!editing && !deleteConfirm && (
//           <div className="space-y-4">
//             {tools.length === 0 && (
//               <Alert>
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertDescription>
//                   No tools configured yet. Add tools to enhance your AI agent's capabilities.
//                 </AlertDescription>
//               </Alert>
//             )}

//             {tools.map((tool) => (
//               <Card key={tool.id} className="p-4">
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     {ToolIcon(tool.type) && (
//                       <ToolIcon(tool.type) className="text-muted-foreground h-5 w-5" />
//                     )}
//                     <div>
//                       <Badge variant="outline" className="capitalize">{tool.type}</Badge>
//                       {tool.config && (
//                         <span className="text-muted-foreground ml-2 text-sm">
//                           {tool.config.email || tool.config.username}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="flex-grow" />
//                   <div className="flex items-center gap-2">
//                     <Button variant="outline" size="sm" onClick={() => setEditing(tool)}>
//                       <Settings2 className="mr-1 h-4 w-4" /> Configure
//                     </Button>
//                     <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(tool.id)}>
//                       <Trash2 className="text-destructive h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               </Card>
//             ))}

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button>
//                   <Plus /> Add Tool
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent>
//                 {Object.entries(TOOL_DEFINITIONS).map(([type, def]) => (
//                   <DropdownMenuItem key={type} onSelect={() => createTool(type).then(setEditing)}>
//                     <def.icon className="mr-2 h-4 w-4" />
//                     <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
//                   </DropdownMenuItem>
//                 ))}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         )}

//         {deleteConfirm && (
//           <div className="space-y-4">
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>
//                 Are you sure you want to delete this tool? This action cannot be undone.
//               </AlertDescription>
//             </Alert>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
//                 Cancel
//               </Button>
//               <Button variant="destructive" onClick={() => deleteTool(deleteConfirm).then(() => setDeleteConfirm(null))}>
//                 Delete
//               </Button>
//             </div>
//           </div>
//         )}

//         {editing && (
//           <form.AppForm>
//             <form onSubmit={handleSave} className="space-y-4">
//               <div className="mb-4 flex items-center gap-2">
//                 {ToolIcon(editing.type) && <ToolIcon(editing.type) className="h-5 w-5" />}
//                 <Badge variant="outline" className="capitalize">{editing.type}</Badge>
//                 <span className="text-muted-foreground text-sm">
//                   {currentTool?.description}
//                 </span>
//               </div>
//               {Object.keys(currentTool?.schema.shape || {}).map((name) => (
//                 <form.AppField key={name} name={name}>
//                   {(field) => (
//                     <field.FormItem>
//                       <field.FormLabel>{name.charAt(0).toUpperCase() + name.slice(1)}</field.FormLabel>
//                       <field.FormControl>
//                         {(() => {
//                           const fieldType = currentTool.schema.shape[name]._def.typeName;
//                           if (fieldType === 'ZodNumber') {
//                             return (
//                               <Input
//                                 type="number"
//                                 value={field.state.value || ''}
//                                 onChange={(e) => field.handleChange(Number(e.target.value))}
//                               />
//                             );
//                           } else if (fieldType === 'ZodBoolean') {
//                             return (
//                               <div className="flex items-center gap-2">
//                                 <Checkbox
//                                   checked={field.state.value || false}
//                                   onCheckedChange={(checked) => field.handleChange(!!checked)}
//                                 />
//                                 <span className="text-sm">Enable TLS/SSL</span>
//                               </div>
//                             );
//                           } else {
//                             return (
//                               <Input
//                                 type={name === 'password' ? 'password' : 'text'}
//                                 value={field.state.value || ''}
//                                 onChange={(e) => field.handleChange(e.target.value)}
//                               />
//                             );
//                           }
//                         })()}
//                       </field.FormControl>
//                       <field.FormMessage />
//                     </field.FormItem>
//                   )}
//                 </form.AppField>
//               ))}
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setEditing(null)}>
//                   Cancel
//                 </Button>
//                 <Button type="submit">Save Changes</Button>
//               </DialogFooter>
//             </form>
//           </form.AppForm>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }
