// Função 'main';
function bugfix(entry) {
	// Transforma a entrada do usuário de string para array, contendo um caractere(bit) por casa, para facilitar seu uso posterior;
	entry = Array.from(entry);
	var entryLen = entry.length;

	var controlBits = markControlBits(entryLen);
	entry = checkParity(entry, controlBits);

	return `Corrected message: ${entry}`;
}

// Função para marcar os bits de controle de paridade da mensagem;
// Retorna um dicionário(chave-valor) contendo os bits de paridade como chave, e o index(posição) de cada bit da mensagem que ele 'checa' como valor;
function markControlBits(entryLen) {
	let controlBits = {};

	for (let i=0; true; i++) {
		// Calcula quais os bits de paridade usando a potenciação de base 2, e coloca-os como chave de um par chave-valor vazio;
		let power = Math.pow(2, i);

		// Se a paridade atual for maior que o tamanho da entrada, o código quebra o loop e retorna os valores que coletou até agora.
		if (power > entryLen) break;
		controlBits[power] = [];

		/* Calcula os bits que cada bit de paridade controla, usando o valor da paridade(chave) e um valor incremental;
			Lógica geral: 
			- Os bits de paridade são potências de base 2, e a mensagem possui um número de bits de paridade relativos ao seu comprimento;
			- Cada bit de paridade checa determinados caracteres da mensagem de acordo com suas posições na string;
			- Um bit de paridade n:
				- Toma conta dos caracteres a partir de n-1 (devido ao cálculo de posição em programação começar do índice 0), selecionando n caracteres por vez antes de pular n caracteres e reiniciar o ciclo
					- Ex) Bit de paridade 2: Toma conta dos caracteres a partir do índice 1, selecionando 2 caracteres por vez antes de pular 2 caracteres e reiniciar o ciclo;
						- Seleciona os índices 1 e 2, pula os índices 3 e 4, seleciona 5 e 6;
						- Sendo assim, o bit de paridade 2 coordena os índices [1, 2, 5, 6] de uma mensagem com 7 caracteres; O bit de paridade 4 coordenas os índices [3,4,5,6] da mesma mensagem;

			Código:
				- A variável 'currPow' é inicializada com o valor da paridade atual;
				- Um loop contínuo que incrementa uma variável i, que serve como um contador de quantos bits seguidos já foram selecionados;
					- Ex) O primeiro loop no bit de paridade 2: 
						- currPow recebe o valor da paridade, ou seja, 2 (currPow = power);
						- A chave do bit de paridade 2 recebe o índice de valor (currPow + i), ou seja, 2 + 0 = 2;
						- A chave do bit de paridade 2 recebe o índice de valor (currPow + i), ou seja, 2 + 1 = 3;
						- Quando o valor de i se iguala ao valor da paridade, quer dizer que já foram selecionados os 2 caracteres antes que sejam pulados os próximos 2 caracteres;
							- Quando isso acontece, o código aumenta o valor da potência em duas vezes seu valor inicial (currPow += 2*power);
							O valor de currPow agora é 2 + (2*2) = 6. Deste modo, o código ignora os 2 bits necessários antes que ele recomece a selecionar os próximos;
							- Além disso, zera-se o contador de quantos bits seguidos foram selecionados.
						- A chave do bit de paridade 2 recebe o índice de valor (currPow + i), ou seja, 6 + 0 = 6;
						- A chave do bit de paridade 2 recebe o índice de valor (currPow + i), ou seja, 6 + 1 = 7;
						- Mais uma vez o valor de i se iguala ao valor da paridade inicial, já que os 2 caracteres já foram selecionados;
						 	- O código incrementa o valor de currPow para (6 + (2*2)) = 10. Porém, não existem 10 caracteres na mensagem (currPow > entryLen)!
						 	Sendo assim, considera-se que já foram coletados todos os bits controlados por aquela paridade específica e o código quebra o loop
						 	atual.
					 	- Prossegue-se para o próximo bit de paridade, realizando os mesmo procedimentos anteriores */
		for (let i = 0, currPow = power; true; i++) {
			if (i == power) {
				currPow += 2*power;
				i = 0;
			}
			if (currPow > entryLen) break;
			controlBits[power].push(+currPow + i);
		}
	}

	return controlBits;
}


/* Preenche o chave-valor retornado pela função 'markControlBits' com os valores apropriados e calcula se há erros com a mensagem.
Caso hajam, corrige-os e retorna a mensagem corrigida; se a mensagem estiver correta, retorna a mensagem em seu estado inicial; */
function checkParity(entry, controlBits) {
	/* Verifica os índices da mensagem coletados com a função 'markControlBits', pegando seus valores e verificando se a quantidade
	total de bits 1 é par. Retorna true ou false para cada chave(bit de paridade), indicando se há ou não erros naquela parte; */
	Object.entries(controlBits).map((bitIndex) => {
		controlBits[bitIndex[0]] = bitIndex[1].filter((x) => entry[x - 1] == 1).length % 2 == 0 ? true : false;
	})

	// Calcula o bit em que há erro, se houver algum, somando o valor do bit de paridade de todos as partes que retornaram false na parte anterior;
	var resultIndex = 0;
	Object.entries(controlBits).forEach((kvpair) => {
		if (kvpair[1] == false) resultIndex += parseInt(kvpair[0]);
	})

	// Corrige a mensagem caso haja algum erro, trocando o bit errado (coloca 1 se o erro for em um 0, e vice-versa)
	entry[resultIndex - 1] = entry[resultIndex - 1] == '1' ? '0' : '1';

	return entry.join('');
}

console.log(bugfix('1111011'));