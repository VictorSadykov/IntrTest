import React from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

export const getFormErrorMessage = (name: string, errors: FieldErrors<FieldValues>): React.JSX.Element => {
  return errors[name] ? <small className="p-error mb-2">{(errors as any)[name].message}</small> : <small className="p-error mb-2">&nbsp;</small>;
}