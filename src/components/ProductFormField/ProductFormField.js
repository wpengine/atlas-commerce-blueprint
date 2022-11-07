import { useState } from 'react';
import styles from './ProductFormField.module.scss';

function camelize(text) {
  return text?.replace(/(?:^|_)([a-z])/g, ($0, $1) => $1.toUpperCase());
}

export default function ProductFormField({ field, value, onChange }) {
  const FieldType = fieldTypes[camelize(field.type)];

  const id = `attribute_${field.type}_${field.id}`;
  const name = `attributes[${field.id}]`;
  const required =
    field.required === true || field.prodOptionType === 'variant';

  function handleChange(value) {
    onChange(`${field.prodOptionType}[${field.id}]`, value);
  }

  return FieldType ? (
    <FieldType
      field={field}
      id={id}
      name={name}
      required={required}
      value={value}
      onChange={handleChange}
    />
  ) : null;
}

function Field({ field, id, required, grouped, children, ...props }) {
  const groupId = `${field.type}_group_${field.id}`;

  const labelProps = {};
  if (grouped === true) {
    labelProps.id = groupId;
  } else if (id) {
    labelProps.htmlFor = id;
  }

  return (
    <div
      className={styles.formField}
      {...(grouped ? { 'aria-labelledby': groupId, role: 'radiogroup' } : {})}
      {...props}
    >
      <label className={styles.formLabel} {...labelProps}>
        {field.display_name}:{' '}
        <small>{required ? '(Required)' : 'Optional'}</small>
      </label>
      {children}
    </div>
  );
}

const fieldTypes = {
  Swatch({ field, id, name, required, value, onChange }) {
    return (
      <Field field={field} id={id} required={required} grouped>
        {field.option_values.map((option) => {
          const id = `attribute_swatch_${field.id}_${option.id}`;

          return (
            <div className={styles.formOptionWrapper} key={option.id}>
              <input
                type='radio'
                name={name}
                value={option.id}
                id={id}
                aria-label={option.label}
                checked={option.id === value}
                onChange={() => onChange(option.id)}
              />
              <label htmlFor={id} className={styles.formOption}>
                {option.value_data?.colors?.map((color, index) => (
                  <span
                    title={option.label}
                    className={
                      styles.formOptionVariant +
                      ' ' +
                      styles.formOptionVariantColor
                    }
                    style={{ backgroundColor: color }}
                    key={index}
                  />
                ))}
                {option.value_data?.image_url ? (
                  <span
                    title={option.label}
                    className={
                      styles.formOptionVariant +
                      ' ' +
                      styles.formOptionVariantPattern
                    }
                    style={{
                      backgroundImage: `url('${option.value_data.image_url}')`,
                    }}
                  />
                ) : null}
              </label>
            </div>
          );
        })}
      </Field>
    );
  },
  RadioButtons({ field, id, name, required, value, onChange }) {
    return (
      <Field field={field} id={id} required={required} grouped>
        {field.option_values.map((option, index) => (
          <label
            htmlFor={`attribute_radio_${field.id}_${option.id}`}
            className={styles.radioLabel}
            key={index}
          >
            <input
              type='radio'
              name={name}
              id={`attribute_radio_${field.id}_${option.id}`}
              value={option.id}
              checked={option.id === value}
              onChange={() => onChange(option.id)}
            />
            {option.label}
          </label>
        ))}
      </Field>
    );
  },
  Rectangles({ field, id, name, required, value, onChange }) {
    return (
      <Field field={field} id={id} required={required} grouped>
        {field.option_values.map((option) => {
          const id = `attribute_rectangle_${field.id}_${option.id}`;

          return (
            <div className={styles.formOptionWrapper} key={option.id}>
              <input
                type='radio'
                name={name}
                value={option.id}
                id={id}
                aria-label={option.label}
                checked={option.id === value}
                onChange={() => onChange(option.id)}
              />
              <label
                htmlFor={id}
                className={styles.formOption + ' ' + styles.formOptionRectangle}
              >
                <span title={option.label} className={styles.formOptionVariant}>
                  {option.label}
                </span>
              </label>
            </div>
          );
        })}
      </Field>
    );
  },
  Text({ field, id, name, required, value, onChange }) {
    return (
      <Field field={field} id={id} required={required}>
        <input
          type='text'
          name={name}
          id={id}
          required={required}
          minLength={field.config?.text_min_length}
          maxLength={field.config?.text_max_length}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    );
  },
  Dropdown({ field, id, name, required, value, onChange }) {
    return (
      <Field field={field} id={id} required={required}>
        <select
          name={name}
          id={id}
          required={required}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
        >
          <option value=''>Choose Options</option>
          {field.option_values.map((option, index) => (
            <option value={option.id} key={index}>
              {option.label}
            </option>
          ))}
        </select>
      </Field>
    );
  },
  MultiLineText({ field, id, name, required, value, onChange }) {
    return (
      <Field field={field} id={id} required={required}>
        <textarea
          type='text'
          name={name}
          id={id}
          required={required}
          minLength={field.config?.text_min_length}
          maxLength={field.config?.text_max_length}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    );
  },
  Checkbox({ field, name, required, value, onChange }) {
    return (
      <Field field={field} required={required}>
        <label
          htmlFor={`attribute_check_${field.id}`}
          className={styles.radioLabel}
        >
          <input
            type='checkbox'
            name={name}
            id={`attribute_check_${field.id}`}
            value={field.option_values[0].id}
            checked={value === field.option_values[0].id}
            onChange={(e) =>
              onChange(field.option_values[e.target.checked ? 0 : 1].id)
            }
          />
          {field.config?.checkbox_label}
        </label>
      </Field>
    );
  },
  NumbersOnlyText({ field, id, name, required, value, onChange }) {
    return (
      <Field field={field} id={id} required={required}>
        <input
          type='number'
          name={name}
          id={id}
          required={required}
          min={field.config?.number_lowest_value}
          max={field.config?.number_highest_value}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Field>
    );
  },
  Date({ field, id, name, required, value, onChange }) {
    const currentYear = new Date().getFullYear();
    const latestDate = field.config?.date_latest_value;
    const latestYear = latestDate
      ? new Date(latestDate).getFullYear()
      : currentYear + 20;
    const yearOptions = [];
    for (var i = currentYear; i <= currentYear; i += 1) {
      yearOptions.push(i);
    }

    const date = new Date(value || '');

    const [inputDate, setInputDate] = useState({
      month: date.getMonth() + 1,
      day: date.getDate(),
      year: date.getFullYear(),
    });

    function handleChange(event) {
      const { target } = event;

      setInputDate((prevDate) => {
        const date = {
          month: /\[month\]$/.test(target.name)
            ? Number(target.value)
            : prevDate.month,
          day: /\[day\]$/.test(target.name)
            ? Number(target.value)
            : prevDate.day,
          year: /\[year\]$/.test(target.name)
            ? Number(target.value)
            : prevDate.year,
        };

        return date;
      });
    }

    return (
      <Field field={field} id={id} required={required}>
        <select name={`${name}[month]`} defaultValue={date?.getMonth() + 1}>
          <option value=''>Month</option>
          {months.map((option) => (
            <option value={option.value} key={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <select name={`${name}[day]`} defaultValue={date?.getDate()}>
          <option value=''>Day</option>
          {Array.apply(null, Array(31))
            .map((_, index) => index + 1)
            .map((day) => (
              <option value={day} key={day}>
                {day}
              </option>
            ))}
        </select>
        <select name={`${name}[year]`} defaultValue={date?.getFullYear()}>
          <option value=''>Year</option>
          {yearOptions.map((year) => (
            <option value={year} key={year}>
              {year}
            </option>
          ))}
        </select>
      </Field>
    );
  },
  File({ field, id, name, required }) {
    return (
      <Field field={field} id={id} required={required}>
        <input type='file' name={name} id={id} />
      </Field>
    );
  },
};

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'
  .split(' ')
  .map((month, index) => ({
    value: index + 1,
    label: month,
  }));
