import { useState } from 'react';

/**
 * Hook responsável por controlar o estado de uma dialog/modal.
 * @param {string} initialMode - Modo inicial da Dialog, setado como padrão para string vazia.
 * @returns {Object} - Retorna o modo atual da dialog e a função para atualizar o modo no estado.
 *
 * @example O hook useDialog retorna dois valores: o modo atual da Dialog e um handler para trocar de modo.
 *    const dialog = useDialog('')
 *    dialog.mode
 *    dialog.onChange(true)
 */
export const useDialog = (initialMode = '') => {
  const [mode, setMode] = useState(initialMode);

  /**
   * Função que realiza a troca de modo do estado da dialog.
   * @param mode - Modo a ser atualizado pela dialog.
   *
   * @example
   * onChange('help')
   */
  function onChange(mode: string) {
    setMode(mode);
  }
  return {
    mode,
    onChange,
  };
};
